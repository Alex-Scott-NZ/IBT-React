'use client';

import { useState, useEffect, useRef } from 'react';
import {
  Worker,
  Viewer,
  ViewMode,
  ScrollMode,
  SpecialZoomLevel,
  LoadError
} from '@react-pdf-viewer/core';
import { toolbarPlugin, ToolbarSlot } from '@react-pdf-viewer/toolbar';
import { pageNavigationPlugin, RenderCurrentPageLabelProps } from '@react-pdf-viewer/page-navigation';
import { zoomPlugin } from '@react-pdf-viewer/zoom';

const PdfViewerComponent = ({ pdfUrl }: { pdfUrl: string }) => {
  const [isMobile, setIsMobile] = useState(false);
  const [loading, setLoading] = useState(true);
  const [currentScale, setCurrentScale] = useState(1);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Track fullscreen changes
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    document.addEventListener('webkitfullscreenchange', handleFullscreenChange);
    
    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
      document.removeEventListener('webkitfullscreenchange', handleFullscreenChange);
    };
  }, []);

  // Create plugins
  const toolbarPluginInstance = toolbarPlugin();
  const pageNavigationPluginInstance = pageNavigationPlugin();
  const zoomPluginInstance = zoomPlugin();
  
  const { Toolbar } = toolbarPluginInstance;
  const { CurrentPageLabel } = pageNavigationPluginInstance;
  const { ZoomIn: PluginZoomIn, ZoomOut: PluginZoomOut } = zoomPluginInstance;

  // Custom zoom handlers for mobile
  const handleZoomIn = () => {
    const newScale = Math.min(currentScale * 1.2, 3);
    setCurrentScale(newScale);
  };

  const handleZoomOut = () => {
    const newScale = Math.max(currentScale / 1.2, 0.5);
    setCurrentScale(newScale);
  };

  return (
    <>
      <style>{`
        /* Ensure container takes full space in fullscreen */
        .pdf-container:-webkit-full-screen {
          width: 100vw !important;
          height: 100vh !important;
          background: white;
          position: fixed !important;
          top: 0 !important;
          left: 0 !important;
          z-index: 99999 !important;
          /* Enable touch gestures in fullscreen */
          touch-action: pan-x pan-y pinch-zoom !important;
          -webkit-user-select: none !important;
          user-select: none !important;
        }
        
        .pdf-container:fullscreen {
          width: 100vw !important;
          height: 100vh !important;
          background: white;
          position: fixed !important;
          top: 0 !important;
          left: 0 !important;
          z-index: 99999 !important;
          /* Enable touch gestures in fullscreen */
          touch-action: pan-x pan-y pinch-zoom !important;
          -webkit-user-select: none !important;
          user-select: none !important;
        }

        /* Header in fullscreen */
        .pdf-container:-webkit-full-screen .page-info-header {
          position: fixed !important;
          top: 0 !important;
          left: 0 !important;
          right: 0 !important;
          z-index: 999999 !important;
        }
        
        .pdf-container:fullscreen .page-info-header {
          position: fixed !important;
          top: 0 !important;
          left: 0 !important;
          right: 0 !important;
          z-index: 999999 !important;
        }

        /* Viewer in fullscreen */
        .pdf-container:-webkit-full-screen .viewer-wrapper {
          height: calc(100vh - 120px) !important;
          margin-top: 50px !important;
          /* Enable pinch zoom in fullscreen */
          touch-action: pan-x pan-y pinch-zoom !important;
        }
        
        .pdf-container:fullscreen .viewer-wrapper {
          height: calc(100vh - 120px) !important;
          margin-top: 50px !important;
          /* Enable pinch zoom in fullscreen */
          touch-action: pan-x pan-y pinch-zoom !important;
        }

        /* Toolbar in fullscreen - moved to top for mobile */
        .pdf-container:-webkit-full-screen .toolbar-wrapper {
          position: fixed !important;
          bottom: 20px !important;
          left: 50% !important;
          transform: translateX(-50%) !important;
          z-index: 999999 !important;
        }
        
        .pdf-container:fullscreen .toolbar-wrapper {
          position: fixed !important;
          bottom: 20px !important;
          left: 50% !important;
          transform: translateX(-50%) !important;
          z-index: 999999 !important;
        }

        /* Mobile fullscreen toolbar at top */
        @media (max-width: 767px) {
          .pdf-container:-webkit-full-screen .toolbar-wrapper {
            top: 60px !important;
            bottom: auto !important;
          }
          
          .pdf-container:fullscreen .toolbar-wrapper {
            top: 60px !important;
            bottom: auto !important;
          }
        }

        /* Smooth scrolling */
        .rpv-core__viewer {
          scroll-behavior: smooth;
        }
        
        /* Mobile specific styles */
        @media (max-width: 767px) {
          .rpv-toolbar__item {
            min-width: 30px !important;
          }
          
          /* Force enable pinch zoom on all elements */
          .rpv-core__viewer,
          .rpv-core__page-layer,
          .rpv-core__inner-page,
          .rpv-core__text-layer,
          .rpv-core__annotation-layer {
            touch-action: pan-x pan-y pinch-zoom !important;
            -webkit-user-select: none !important;
            user-select: none !important;
          }
        }

        /* Zoom controls overlay for mobile fullscreen */
        .mobile-zoom-controls {
          position: fixed;
          right: 10px;
          top: 50%;
          transform: translateY(-50%);
          display: flex;
          flex-direction: column;
          gap: 10px;
          z-index: 1000000;
        }

        .zoom-button {
          width: 50px;
          height: 50px;
          border-radius: 25px;
          background: rgba(0, 0, 0, 0.8);
          color: white;
          border: none;
          font-size: 24px;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          touch-action: manipulation;
        }

        .zoom-indicator {
          position: absolute;
          top: 60px;
          right: 10px;
          background: rgba(0, 0, 0, 0.7);
          color: white;
          padding: 5px 10px;
          border-radius: 4px;
          font-size: 14px;
          z-index: 5;
          pointer-events: none;
        }
      `}</style>
      
      <div 
        ref={containerRef}
        className="pdf-container"
        style={{
          border: '1px solid rgba(0, 0, 0, 0.3)',
          display: 'flex',
          flexDirection: 'column',
          height: isMobile ? 'calc(100vh - 120px)' : 'calc(100vh - 200px)',
          minHeight: isMobile ? '400px' : '600px',
          maxHeight: isMobile ? 'none' : '1000px',
          position: 'relative',
          marginBottom: isMobile ? '20px' : '50px',
        }}
      >
        {/* Page info header */}
        <div
          className="page-info-header"
          style={{
            alignItems: 'center',
            backgroundColor: '#eeeeee',
            borderBottom: '1px solid rgba(0, 0, 0, 0.3)',
            display: loading ? 'none' : 'flex',
            justifyContent: 'center',
            padding: '8px',
          }}
        >
          <CurrentPageLabel>
            {(props: RenderCurrentPageLabelProps) => (
              <span style={{ fontSize: '16px', fontWeight: '500' }}>
                Page {props.currentPage + 1} of {props.numberOfPages}
              </span>
            )}
          </CurrentPageLabel>
        </div>

        {/* Zoom indicator */}
        {currentScale !== 1 && !loading && (
          <div className="zoom-indicator">
            {Math.round(currentScale * 100)}%
          </div>
        )}

        {/* Mobile zoom controls for fullscreen */}
        {isMobile && isFullscreen && !loading && (
          <div className="mobile-zoom-controls">
            <button className="zoom-button" onClick={handleZoomIn}>
              +
            </button>
            <button className="zoom-button" onClick={handleZoomOut}>
              −
            </button>
          </div>
        )}

        {/* Loading state */}
        {loading && (
          <div className="absolute inset-0 flex items-center justify-center bg-white z-10">
            <div className="flex flex-col items-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-communist-red"></div>
              <div className="mt-4 text-gray-600">Loading PDF...</div>
            </div>
          </div>
        )}

        {/* PDF Viewer with continuous scroll */}
        <div 
          className="viewer-wrapper"
          style={{
            flex: 1,
            overflow: 'auto',
            WebkitOverflowScrolling: 'touch',
          }}
        >
          <Worker workerUrl="https://unpkg.com/pdfjs-dist@3.4.120/build/pdf.worker.min.js">
            <Viewer
              fileUrl={pdfUrl}
              plugins={[toolbarPluginInstance, pageNavigationPluginInstance, zoomPluginInstance]}
              scrollMode={ScrollMode.Vertical}
              viewMode={ViewMode.SinglePage}
              defaultScale={
                isMobile ? SpecialZoomLevel.PageWidth : SpecialZoomLevel.PageFit
              }
              onDocumentLoad={() => {
                console.log('PDF loaded successfully');
                setLoading(false);
              }}
              onZoom={(e) => {
                setCurrentScale(e.scale);
              }}
              renderLoader={(percentages: number) => (
                <div className="flex items-center justify-center h-full">
                  <div className="flex flex-col items-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-communist-red"></div>
                    <div className="mt-4 text-gray-600">
                      Loading... {Math.round(percentages)}%
                    </div>
                  </div>
                </div>
              )}
              renderError={(error: LoadError) => {
                setLoading(false);
                return (
                  <div className="flex items-center justify-center h-full bg-white">
                    <div className="text-center p-4">
                      <svg
                        className="mx-auto h-12 w-12 text-red-500 mb-4"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                      <h3 className="text-lg font-medium text-gray-900 mb-2">
                        Failed to load PDF
                      </h3>
                      <p className="text-gray-600 mb-4">
                        {error.message || 'The PDF could not be loaded.'}
                      </p>
                      <a
                        href={pdfUrl}
                        download
                        className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-communist-red hover:bg-red-700"
                      >
                        Download PDF instead
                      </a>
                    </div>
                  </div>
                );
              }}
            />
          </Worker>
        </div>

        {/* Toolbar */}
        <div 
          className="toolbar-wrapper"
          style={{
            position: 'absolute',
            bottom: '16px',
            left: '50%',
            transform: 'translateX(-50%)',
            zIndex: 10,
            background: '#eeeeee',
            border: '1px solid rgba(0, 0, 0, 0.2)',
            borderRadius: '4px',
            padding: isMobile ? '4px' : '4px',
            fontSize: isMobile ? '14px' : '16px',
            boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
            display: loading ? 'none' : 'block',
          }}
        >
          <Toolbar>
            {(props: ToolbarSlot) => {
              const {
                Download,
                Print,
                ZoomIn,
                ZoomOut,
              } = props;
              
              // Custom fullscreen handler
              const handleFullScreen = () => {
                const container = document.querySelector('.pdf-container');
                if (container) {
                  if (document.fullscreenElement) {
                    document.exitFullscreen();
                  } else {
                    container.requestFullscreen();
                  }
                }
              };
              
              return (
                <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                  {/* Hide zoom buttons on mobile in fullscreen (using floating buttons instead) */}
                  {(!isMobile || !isFullscreen) && (
                    <>
                      <div style={{ padding: '0 2px' }}>
                        <ZoomOut />
                      </div>
                      <div style={{ padding: '0 2px' }}>
                        <ZoomIn />
                      </div>
                    </>
                  )}
                  <div style={{ padding: '0 2px' }}>
                    <button
                      className="rpv-core__minimal-button"
                      onClick={handleFullScreen}
                      title={isFullscreen ? "Exit fullscreen" : "Enter fullscreen"}
                    >
                      <svg
                        aria-hidden="true"
                        className="rpv-core__icon"
                        focusable="false"
                        height="16"
                        viewBox="0 0 16 16"
                        width="16"
                      >
                        {isFullscreen ? (
                          // Exit fullscreen icon
                          <path d="M1.5,6 L1.5,1.5 L6,1.5 L6,2.5 L2.5,2.5 L2.5,6 L1.5,6 Z M10,1.5 L14.5,1.5 L14.5,6 L13.5,6 L13.5,2.5 L10,2.5 L10,1.5 Z M2.5,10 L2.5,13.5 L6,13.5 L6,14.5 L1.5,14.5 L1.5,10 L2.5,10 Z M13.5,10 L14.5,10 L14.5,14.5 L10,14.5 L10,13.5 L13.5,13.5 L13.5,10 Z" />
                        ) : (
                          // Enter fullscreen icon
                          <path d="M1.5,1 L6,1 L6,2 L2.5,2 L2.5,5.5 L1.5,5.5 L1.5,1 Z M10,1 L14.5,1 L14.5,5.5 L13.5,5.5 L13.5,2 L10,2 L10,1 Z M2.5,10.5 L2.5,14 L6,14 L6,15 L1.5,15 L1.5,10.5 L2.5,10.5 Z M13.5,10.5 L14.5,10.5 L14.5,15 L10,15 L10,14 L13.5,14 L13.5,10.5 Z" />
                        )}
                      </svg>
                    </button>
                  </div>
                  <div style={{ padding: '0 2px' }}>
                    <Download />
                  </div>
                  {!isMobile && (
                    <div style={{ padding: '0 2px' }}>
                      <Print />
                    </div>
                  )}
                </div>
              );
            }}
          </Toolbar>
        </div>
      </div>
    </>
  );
};

export default PdfViewerComponent;