import React, { useEffect, useState } from "react";
import { Carousel } from "react-bootstrap";
import { FileText } from 'lucide-react';
import './pdfViewer.css';

function MultiPDFViewer(props) {
    const [pdfItems, setPdfItems] = useState([]);
    const [loading, setLoading] = useState(false);
    
    useEffect(() => {
        if (props && props.pdfs && props.pdfs.length > 0) {
            setLoading(true);
            setPdfItems(props.pdfs);
            setLoading(false);
        }
    }, [props]);
    
    const isPDF = (url) => {
        if (url && typeof url === 'string') {
            return url.includes('data:application/pdf') || 
                   url.startsWith('data:application/octet-stream;base64,') ||
                   url.includes('pdf');
        }
        return false;
    };
    
    return (
        <div style={{ 
            background: 'rgba(255, 255, 255, 0.95)', 
            borderRadius: '16px',
            overflow: 'hidden'
        }}>
            {pdfItems && pdfItems.length > 0 && (
                <div style={{ maxWidth: "100%", width: "100%" }}>
                    <Carousel 
                        interval={null}
                        indicators={pdfItems.length > 1}
                        prevIcon={<span aria-hidden="true" className="carousel-control-prev-icon" />}
                        nextIcon={<span aria-hidden="true" className="carousel-control-next-icon" />}
                    >
                        {pdfItems.map((pdfItem, index) => (
                            <Carousel.Item key={index}>
                                {isPDF(pdfItem) ? (
                                    <div className="pdf-container">
                                        {loading && (
                                            <div className="pdf-loading">
                                                Loading PDF...
                                            </div>
                                        )}
                                        <iframe
                                            className="pdf-frame"
                                            src={pdfItem}
                                            title={`pdf-document-${index}`}
                                            onLoad={() => setLoading(false)}
                                        />
                                    </div>
                                ) : (
                                    <div className="invalid-pdf">
                                        <FileText size={24} style={{ marginRight: '8px' }} />
                                        Invalid PDF format
                                    </div>
                                )}
                            </Carousel.Item>
                        ))}
                    </Carousel>
                </div>
            )}
        </div>
    );
}

export default MultiPDFViewer;