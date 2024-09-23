// Release.tsx

interface ReleaseProps {
  _id?: string;
  title?: string;
  year?: number;
  image?: string;
  artist?: string;
}

function Release({ _id, title, year, image, artist }: ReleaseProps) {
  if (!_id || !title) {
    return <div>No release data available</div>;
  }

  return (
    <div className="column is-full-mobile is-half-tablet is-one-third-desktop is-one-quarter-widescreen">
      <div className="card">
        <div className="card-image">
          <figure className="image is-4by3">
            <img src={image} alt={title} style={{ objectFit: 'cover' }} />
          </figure>
        </div>
        <div className="card-content">
          <div className="media">
            <div className="media-content">
              <p className="title is-4">{title}</p>
              <p className="subtitle is-6">{year}</p>
            </div>
          </div>
          <div className="content">
            <p>Artist: {artist}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Release