'use client';

import { Worker, Viewer, ViewMode, ScrollMode } from '@react-pdf-viewer/core';
import { toolbarPlugin, ToolbarSlot } from '@react-pdf-viewer/toolbar';

const PdfViewerComponent = ({ pdfUrl }: { pdfUrl: string }) => {
  const toolbarPluginInstance = toolbarPlugin({
    fullScreenPlugin: {
      getFullScreenTarget: (pagesContainer: HTMLElement): HTMLElement => {
        const container = pagesContainer.closest('.js-viewer-container');
        return container instanceof HTMLElement ? container : pagesContainer;
      },
      renderExitFullScreenButton: () => <></>,
    },
  });
  const { Toolbar } = toolbarPluginInstance;

  return (
    <>
      <style>{`
        .rpv-full-screen__overlay {
          display: none;
        }
      `}</style>
      <div
        className="js-viewer-container"
        style={{
          border: '1px solid rgba(0, 0, 0, 0.3)',
          display: 'flex',
          flexDirection: 'column',
          height: '850px',
          position: 'relative',
          marginBottom: '50px',
        }}
      >
        {/* Your existing PDF viewer JSX */}
        <div
          style={{
            alignItems: 'center',
            backgroundColor: '#eeeeee',
            borderBottom: '1px solid rgba(0, 0, 0, 0.1)',
            display: 'flex',
            padding: '0.25rem',
            position: 'absolute',
            bottom: '16px',
            left: '50%',
            transform: 'translate(-50%, 0)',
            zIndex: 1,
            borderRadius: '2px',
            border: '1px solid rgba(0, 0, 0, 0.2)',
          }}
        >
          <Toolbar>
            {({
              ZoomOut,
              ZoomIn,
              GoToPreviousPage,
              GoToNextPage,
              CurrentPageInput,
              NumberOfPages,
              EnterFullScreen,
              Download,
              Print,
            }: ToolbarSlot) => (
              <>
                <ZoomOut />
                <ZoomIn />
                <GoToPreviousPage />
                <CurrentPageInput /> / <NumberOfPages />
                <GoToNextPage />
                <EnterFullScreen />
                <Download />
                <Print />
              </>
            )}
          </Toolbar>
        </div>
        <div
          style={{
            flex: 1,
            overflow: 'hidden',
          }}
        >
          <Worker workerUrl="https://unpkg.com/pdfjs-dist@3.4.120/build/pdf.worker.min.js">
            <Viewer
              fileUrl={pdfUrl}
              plugins={[toolbarPluginInstance]}
              viewMode={ViewMode.SinglePage}
              scrollMode={ScrollMode.Page}
            />
          </Worker>
        </div>
      </div>
    </>
  );
};

export default PdfViewerComponent;
