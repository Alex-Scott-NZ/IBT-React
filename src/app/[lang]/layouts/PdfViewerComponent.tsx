// src\app\[lang]\layouts\PdfViewerComponent.tsx
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
  const viewerRef = useRef<any>(null);

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

  // Create plugins with zoom plugin for better control
  const zoomPluginInstance = zoomPlugin();
  const toolbarPluginInstance = toolbarPlugin();
  const pageNavigationPluginInstance = pageNavigationPlugin();
  
  const { Toolbar } = toolbarPluginInstance;
  const { CurrentPageLabel } = pageNavigationPluginInstance;
  const { zoomTo } = zoomPluginInstance;

  // Enhanced zoom handlers using zoom plugin
  const handleZoomIn = () => {
    const newScale = Math.min(currentScale * 1.25, 4); // Max 400%
    zoomTo(newScale);
  };

  const handleZoomOut = () => {
    const newScale = Math.max(currentScale * 0.8, 0.25); // Min 25%
    zoomTo(newScale);
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
        }
        
        .pdf-container:fullscreen {
          width: 100vw !important;
          height: 100vh !important;
          background: white;
          position: fixed !important;
          top: 0 !important;
          left: 0 !important;
          z-index: 99999 !important;
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
        }
        
        .pdf-container:fullscreen .viewer-wrapper {
          height: calc(100vh - 120px) !important;
          margin-top: 50px !important;
        }

        /* Toolbar in fullscreen */
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

        /* Smooth scrolling */
        .rpv-core__viewer {
          scroll-behavior: smooth;
        }
        
        /* Mobile specific styles */
        @media (max-width: 767px) {
          .rpv-toolbar__item {
            min-width: 30px !important;
          }
        }

        /* Header zoom controls for mobile fullscreen */
        .header-zoom-controls {
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .header-zoom-button {
          width: 32px;
          height: 32px;
          border-radius: 4px;
          background: rgba(255, 255, 255, 0.9);
          color: #333;
          border: 1px solid rgba(0, 0, 0, 0.2);
          font-size: 18px;
          font-weight: bold;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          touch-action: manipulation;
          user-select: none;
          -webkit-user-select: none;
          -webkit-tap-highlight-color: transparent;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.2);
          transition: all 0.1s ease;
        }

        .header-zoom-button:active {
          background: rgba(255, 255, 255, 1);
          transform: scale(0.95);
        }

        .header-zoom-button:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        .zoom-percentage {
          font-size: 12px;
          color: #666;
          min-width: 40px;
          text-align: center;
          background: rgba(255, 255, 255, 0.9);
          padding: 2px 6px;
          border-radius: 3px;
          border: 1px solid rgba(0, 0, 0, 0.1);
          transition: all 0.1s ease;
        }

        /* Enhanced page info header layout */
        .page-info-content {
          display: flex;
          align-items: center;
          justify-content: space-between;
          width: 100%;
          max-width: 100%;
        }

        .page-info-left {
          flex: 1;
          display: flex;
          justify-content: flex-start;
        }

        .page-info-center {
          flex: 1;
          display: flex;
          justify-content: center;
        }

        .page-info-right {
          flex: 1;
          display: flex;
          justify-content: flex-end;
        }

        /* Hide zoom controls on desktop or when not in fullscreen */
        .header-zoom-controls.hidden {
          display: none;
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
        {/* Enhanced page info header with zoom controls */}
        <div
          className="page-info-header"
          style={{
            alignItems: 'center',
            backgroundColor: '#eeeeee',
            borderBottom: '1px solid rgba(0, 0, 0, 0.3)',
            display: loading ? 'none' : 'flex',
            justifyContent: 'center',
            padding: '8px 12px',
          }}
        >
          <div className="page-info-content">
            {/* Left side - zoom controls for mobile fullscreen */}
            <div className="page-info-left">
              <div className={`header-zoom-controls ${!(isMobile && isFullscreen) ? 'hidden' : ''}`}>
                <button 
                  className="header-zoom-button" 
                  onClick={handleZoomOut}
                  disabled={currentScale <= 0.25}
                  aria-label="Zoom out"
                >
                  −
                </button>
                <div className="zoom-percentage">
                  {Math.round(currentScale * 100)}%
                </div>
                <button 
                  className="header-zoom-button" 
                  onClick={handleZoomIn}
                  disabled={currentScale >= 4}
                  aria-label="Zoom in"
                >
                  +
                </button>
                <button 
                  className="header-zoom-button" 
                  onClick={() => zoomTo(1)}
                  aria-label="Reset zoom"
                  style={{ fontSize: '14px', width: '36px' }}
                >
                  ⌂
                </button>
              </div>
            </div>

            {/* Center - page info */}
            <div className="page-info-center">
              <CurrentPageLabel>
                {(props: RenderCurrentPageLabelProps) => (
                  <span style={{ fontSize: '16px', fontWeight: '500' }}>
                    Page {props.currentPage + 1} of {props.numberOfPages}
                  </span>
                )}
              </CurrentPageLabel>
            </div>

            {/* Right side - reserved for future controls */}
            <div className="page-info-right">
              {/* Could add exit fullscreen button here if needed */}
            </div>
          </div>
        </div>

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
              onDocumentLoad={(e) => {
                console.log('PDF loaded successfully');
                setLoading(false);
                viewerRef.current = e;
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
                  {/* Show zoom buttons only on desktop or when not in mobile fullscreen */}
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
                        <path d="M1.5,1 L6,1 L6,2 L2.5,2 L2.5,5.5 L1.5,5.5 L1.5,1 Z M10,1 L14.5,1 L14.5,5.5 L13.5,5.5 L13.5,2 L10,2 L10,1 Z M2.5,10.5 L2.5,14 L6,14 L6,15 L1.5,15 L1.5,10.5 L2.5,10.5 Z M13.5,10.5 L14.5,10.5 L14.5,15 L10,15 L10,14 L13.5,14 L13.5,10.5 Z" />
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