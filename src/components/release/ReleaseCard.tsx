import React, { useRef, useEffect, useState } from 'react';
import { Release, Artist } from '../../interfaces/types';

interface ReleaseCardProps {
  release: Release;
  artists: Artist[];
}

function ReleaseCard({ release, artists }: ReleaseCardProps) {
  const titleRef = useRef<HTMLParagraphElement>(null);
  const [titleFontSize, setTitleFontSize] = useState(16); // Starting font size

  const getArtistName = () => {
    if (typeof release.artist === 'string') {
      const artist = artists.find(a => a._id === release.artist);
      return artist ? artist.name : 'Unknown Artist';
    } else {
      return release.artist.name;
    }
  };

  useEffect(() => {
    const adjustFontSize = () => {
      const titleElement = titleRef.current;
      if (titleElement) {
        let fontSize = 16;
        titleElement.style.fontSize = `${fontSize}px`;
        
        while (titleElement.scrollHeight > titleElement.clientHeight && fontSize > 10) {
          fontSize -= 0.5;
          titleElement.style.fontSize = `${fontSize}px`;
        }
        
        setTitleFontSize(fontSize);
      }
    };

    adjustFontSize();
    window.addEventListener('resize', adjustFontSize);
    return () => window.removeEventListener('resize', adjustFontSize);
  }, [release.title]);

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
          src={release.image} 
          alt={release.title} 
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
          ref={titleRef}
          className="title is-4" 
          style={{ 
            color: 'white', 
            fontSize: `${titleFontSize}px`, 
            lineHeight: '1.2', 
            height: '2.4em', 
            overflow: 'hidden',
            marginBottom: '0.5rem'
          }}
        >
          {release.title}
        </p>
        <p className="subtitle is-6" style={{ color: 'white', marginBottom: '0.5rem' }}>{getArtistName()}</p>
        <div className="content mt-auto">
          <p className="is-size-7 mb-1" style={{ color: 'white' }}>Genre: {release.genre}</p>
          <p className="is-size-7" style={{ color: 'white' }}>Released: {release.year}</p>
        </div>
      </div>
    </div>
  );
}

export default ReleaseCard;