import React, { useEffect, useState } from "react";
import { Carousel } from "react-bootstrap";
import './multiImageUpload.css';

function MultiMediaUploadView(props) {
    const [mediaItems, setMediaItems] = useState([]);
    
    useEffect(() => {
        if (props && props.images && props.images.length > 0) {
            setMediaItems(props.images);
        }
    }, [props]);

    const isVideo = (url) => {
        // Check if the base64 string suggests it's a video
        if (url && typeof url === 'string') {
            return url.includes('data:video/') || 
                   url.includes('data:application/octet-stream') ||
                   url.includes('video/');
        }
        return false;
    };

    return (
        <div>
            {mediaItems && mediaItems.length > 0 && (
                <div style={{ maxWidth: "600px", width: "100%" }}>
                    <Carousel>
                        {mediaItems.map((mediaItem, index) => (
                            <Carousel.Item key={index}>
                                {isVideo(mediaItem) ? (
                                    <video 
                                        className="d-block w-100" 
                                        style={{
                                            maxHeight: '300px',
                                            objectFit: 'contain',
                                            backgroundColor: '#f8f9fa'
                                        }}
                                        src={mediaItem} 
                                        controls
                                        alt={`media-${index}`}
                                    />
                                ) : (
                                    <img 
                                        className="d-block w-100" 
                                        style={{
                                            maxHeight: '300px',
                                            objectFit: 'contain',
                                            backgroundColor: '#f8f9fa'
                                        }}
                                        src={mediaItem} 
                                        alt={`media-${index}`}
                                    />
                                )}
                            </Carousel.Item>
                        ))}
                    </Carousel>
                </div>
            )}
        </div>
    );
}

export default MultiMediaUploadView;