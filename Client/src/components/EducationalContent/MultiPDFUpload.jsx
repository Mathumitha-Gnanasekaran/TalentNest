import React, { useEffect, useState } from "react";
import { useDropzone } from "react-dropzone";
import { Button, Modal } from "react-bootstrap";
import { FileText, Eye } from 'lucide-react';
import MultiPDFViewer from './MultiPDFViewer';

function MultiPDFUpload(props) {
    const [pdfFiles, setPdfFiles] = useState([]);
    const [processedPDFs, setProcessedPDFs] = useState([]);
    const [isHovered, setIsHovered] = useState(false);
    const [showViewer, setShowViewer] = useState(false);
    const [selectedPDF, setSelectedPDF] = useState(null);

    useEffect(() => {
        // Only process files if there are new ones
        if (pdfFiles.length > 0) {
            processFiles();
        }
    }, [pdfFiles]);

    useEffect(() => {
        // Only send processed PDFs to parent when they're ready
        if (processedPDFs.length > 0) {
            props.multiHandle(processedPDFs);
        }
    }, [processedPDFs]);

    const processFiles = async () => {
        const processed = [];
        
        for (const file of pdfFiles) {
            if (file.type === 'application/pdf') {
                try {
                    const base64 = await fileToBase64Promise(file);
                    processed.push({
                        file: file,
                        base64: base64,
                        preview: base64, // For PDFs, we'll use the base64 directly
                        name: file.name,
                        size: Math.round(file.size/1024) // Size in KB
                    });
                } catch (error) {
                    console.error("Error processing PDF:", error);
                }
            }
        }
        
        setProcessedPDFs(processed);
    };

    const fileToBase64Promise = (file) => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => resolve(reader.result);
            reader.onerror = (error) => reject(error);
        });
    };

    const onDrop = (acceptedFiles) => {
        // Filter for PDF files only
        const pdfOnly = acceptedFiles.filter(file => file.type === 'application/pdf');
        setPdfFiles((prevState) => [...prevState, ...pdfOnly]);
    };

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: {
            'application/pdf': ['.pdf']
        },
        multiple: true,
    });

    const removePDF = (index) => {
        const newPDFs = pdfFiles.filter((_, i) => i !== index);
        const newProcessedPDFs = processedPDFs.filter((_, i) => i !== index);
        setPdfFiles(newPDFs);
        setProcessedPDFs(newProcessedPDFs);
    };

    const handleViewPDF = (pdf) => {
        setSelectedPDF(pdf);
        setShowViewer(true);
    };

    // Inline styles
    const dropzoneStyles = {
        cursor: 'pointer',
        marginBottom: '15px'
    };

    const uploadButtonStyles = {
        display: 'flex',
        alignItems: 'center',
        background: 'linear-gradient(135deg, #92400e, #ea580c)',
        color: '#fff',
        padding: '8px 15px',
        borderRadius: '10px',
        maxWidth: '200px',
        transition: 'all 0.2s ease',
        transform: isHovered ? 'translateY(-2px)' : 'translateY(0)',
        boxShadow: isHovered ? '0 4px 12px rgba(30, 136, 229, 0.4)' : 'none'
    };

    const plusIconStyles = {
        fontSize: '22px',
        marginRight: '5px',
        fontWeight: 'bold'
    };

    const dropTextStyles = {
        padding: '20px',
        textAlign: 'center',
        border: '2px dashed #1e88e5',
        borderRadius: '10px',
        backgroundColor: 'rgba(30, 136, 229, 0.05)',
        color: '#1e88e5'
    };

    const pdfListStyles = {
        marginTop: '10px',
        padding: '10px',
        border: '1px solid #ddd',
        borderRadius: '10px'
    };

    const pdfItemStyles = {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '10px',
        borderBottom: '1px solid #eee'
    };

    return (
        <div style={{ width: '100%' }}>
            <div 
                {...getRootProps()} 
                style={dropzoneStyles}
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
            >
                <input {...getInputProps()} />
                {isDragActive ? (
                    <div style={dropTextStyles}>
                        <p>Drop your PDF files here...</p>
                    </div>
                ) : (
                    <div style={uploadButtonStyles}>
                        <span style={plusIconStyles}>+</span>
                        <span style={{ margin: '0 5px' }}>ADD PDF</span>
                        <div style={{ display: 'flex', marginLeft: '5px' }}>
                            <FileText size={16} />
                        </div>
                    </div>
                )}
            </div>

            {processedPDFs.length > 0 && (
                <div style={pdfListStyles}>
                    {processedPDFs.map((item, index) => (
                        <div key={index} style={{
                            ...pdfItemStyles,
                            borderBottom: index < processedPDFs.length - 1 ? '1px solid #eee' : 'none'
                        }}>
                            <div>
                                <strong>{item.name}</strong> ({item.size} KB)
                            </div>
                            <div>
                                <Button 
                                    variant="primary" 
                                    size="sm" 
                                    style={{ marginRight: '10px' }}
                                    onClick={() => handleViewPDF(item)}
                                >
                                    <Eye size={16} /> View
                                </Button>
                                <Button 
                                    variant="danger" 
                                    size="sm" 
                                    onClick={() => removePDF(index)}
                                >
                                    Remove
                                </Button>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            <Modal show={showViewer} onHide={() => setShowViewer(false)} size="lg">
                <Modal.Header closeButton>
                    <Modal.Title>{selectedPDF?.name}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {selectedPDF && <MultiPDFViewer pdfs={[selectedPDF.base64]} />}
                </Modal.Body>
            </Modal>
        </div>
    );
}

export default MultiPDFUpload;