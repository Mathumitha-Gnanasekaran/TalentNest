import React, { useEffect, useState } from "react";
import { useDropzone } from "react-dropzone";
import { Button, Carousel } from "react-bootstrap";
import { Image, Film } from 'lucide-react';
import imageCompression from "browser-image-compression";

function MultiImageUpload(props) {
    const [media, setMedia] = useState([]);
    const [processedMedia, setProcessedMedia] = useState([]);
    const [isHovered, setIsHovered] = useState(false);

    useEffect(() => {
        // Only process files if there are new ones
        if (media.length > 0) {
            processFiles();
        }
    }, [media]);

    useEffect(() => {
        // Only send processed media to parent when it's ready
        if (processedMedia.length > 0) {
            props.multiHandle(processedMedia);
        }
    }, [processedMedia]);

    const processFiles = async () => {
        const processed = [];
        
        for (const file of media) {
            const isImage = file.type.startsWith('image/');
            
            if (isImage) {
                // Use image compression for images
                try {
                    const options = {
                        maxWidthOrHeight: 1000,
                        useWebWorker: true,
                    };
                    const compressedFile = await imageCompression(file, options);
                    const base64 = await fileToBase64Promise(compressedFile);
                    processed.push({
                        file: compressedFile,
                        base64: base64,
                        type: 'image',
                        preview: URL.createObjectURL(compressedFile)
                    });
                } catch (error) {
                    console.error("Error compressing image:", error);
                }
            } else {
                // For videos, just convert to base64 without compression
                try {
                    const base64 = await fileToBase64Promise(file);
                    processed.push({
                        file: file,
                        base64: base64,
                        type: 'video',
                        preview: URL.createObjectURL(file)
                    });
                } catch (error) {
                    console.error("Error processing video:", error);
                }
            }
        }
        
        setProcessedMedia(processed);
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
        setMedia((prevState) => [...prevState, ...acceptedFiles]);
    };

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: {
            'image/*': [],
            'video/*': []
        },
        multiple: true,
    });

    const removeMedia = (index) => {
        const newMedia = media.filter((_, i) => i !== index);
        const newProcessedMedia = processedMedia.filter((_, i) => i !== index);
        setMedia(newMedia);
        setProcessedMedia(newProcessedMedia);
    };

    // Inline styles
    const dropzoneStyles = {
        cursor: 'pointer',
        marginBottom: '15px'
    };

    const uploadButtonStyles = {
        display: 'flex',
        alignItems: 'center',
        background: 'linear-gradient(to bottom right, #7c2d12, #b45309)',
        color: '#fff',
        padding: '8px 15px',
        borderRadius: '10px',
        maxWidth: '200px',
        transition: 'all 0.2s ease',
        transform: isHovered ? 'translateY(-2px)' : 'translateY(0)',
        boxShadow: isHovered ? '0 4px 12px rgba(99, 102, 241, 0.4)' : 'none'
    };

    const plusIconStyles = {
        fontSize: '22px',
        marginRight: '5px',
        fontWeight: 'bold'
    };

    const buttonTextStyles = {
        margin: '0 5px'
    };

    const iconContainerStyles = {
        display: 'flex',
        gap: '5px',
        marginLeft: '5px'
    };

    const dropTextStyles = {
        padding: '20px',
        textAlign: 'center',
        border: '2px dashed #6366f1',
        borderRadius: '10px',
        backgroundColor: 'rgba(99, 102, 241, 0.05)',
        color: '#6366f1'
    };

    const mediaPreviewStyles = {
        marginTop: '10px',
        maxWidth: '600px',
        width: '100%',
        borderRadius: '10px',
        overflow: 'hidden',
        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
    };

    const mediaItemStyles = {
        maxHeight: '300px',
        objectFit: 'contain',
        backgroundColor: '#f8f9fa',
        width: '100%'
    };

    const captionStyles = {
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        borderRadius: '5px',
        padding: '5px',
        bottom: '10px'
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
                        <p>Drop your files here...</p>
                    </div>
                ) : (
                    <div style={uploadButtonStyles}>
                        <span style={plusIconStyles}>+</span>
                        <span style={buttonTextStyles}>ADD MEDIA</span>
                        <div style={iconContainerStyles}>
                            <Image size={16} />
                            <Film size={16} />
                        </div>
                    </div>
                )}
            </div>

            {processedMedia.length > 0 && (
                <div style={mediaPreviewStyles}>
                    <Carousel>
                        {processedMedia.map((item, index) => (
                            <Carousel.Item key={index}>
                                {item.type === 'image' ? (
                                    <img 
                                        style={mediaItemStyles} 
                                        src={item.preview} 
                                        alt={`media-${index}`} 
                                    />
                                ) : (
                                    <video 
                                        style={mediaItemStyles} 
                                        src={item.preview} 
                                        controls
                                    />
                                )}
                                <Carousel.Caption style={captionStyles}>
                                    <Button 
                                        variant="danger" 
                                        size="sm" 
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            removeMedia(index);
                                        }}
                                    >
                                        Remove
                                    </Button>
                                </Carousel.Caption>
                            </Carousel.Item>
                        ))}
                    </Carousel>
                </div>
            )}
        </div>
    );
}

export default MultiImageUpload;