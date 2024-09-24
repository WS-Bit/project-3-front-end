import React, { useRef, useEffect, useState } from 'react';
import { Artist } from '../interfaces/types';

interface ArtistCardProps {
  artist: Artist;
}

export default function ArtistCard({ artist }: ArtistCardProps) {
  const nameRef = useRef<HTMLParagraphElement>(null);
  const [nameFontSize, setNameFontSize] = useState(16); // Starting font size

  useEffect(() => {
    const adjustFontSize = () => {
      const nameElement = nameRef.current;
      if (nameElement) {
        let fontSize = 16;
        nameElement.style.fontSize = `${fontSize}px`;
        
        while (nameElement.scrollHeight > nameElement.clientHeight && fontSize > 10) {
          fontSize -= 0.5;
          nameElement.style.fontSize = `${fontSize}px`;
        }
        
        setNameFontSize(fontSize);
      }
    };

    adjustFontSize();
    window.addEventListener('resize', adjustFontSize);
    return () => window.removeEventListener('resize', adjustFontSize);
  }, [artist.name]);

  return (
    <div style={{
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
      width: '100%',
      maxWidth: '250px', // Set a max width for consistency
      margin: '0 auto'
    }}>
      <div style={{ width: '100%', paddingTop: '100%', position: 'relative' }}>
        <img 
          src={artist.image} 
          alt={artist.name} 
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            objectFit: 'cover'
          }}
        />
      </div>
      <div style={{ padding: '1rem', flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
        <p 
          ref={nameRef}
          className="title is-5" 
          style={{ 
            color: 'white', 
            fontSize: `${nameFontSize}px`, 
            lineHeight: '1.2', 
            height: '2.4em', 
            overflow: 'hidden',
            marginBottom: '0.5rem'
          }}
        >
          {artist.name}
        </p>
        <div className="content mt-auto">
          <p className="is-size-7 mb-1" style={{ color: 'white' }}>Genre: {artist.genre}</p>
          <p className="is-size-7" style={{ color: 'white' }}>Country: {artist.country}</p>
        </div>
      </div>
    </div>
  );
}