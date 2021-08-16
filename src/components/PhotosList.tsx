import { useEffect, useState } from 'react';
import axios from 'axios';
import css from './PhotoList.module.css';
import { Photo } from '../models/Photo';

export function PhotosList() {
  const [refresh, setRefresh] = useState(0);
  const [name, setName] = useState('');

  return (
    <div>
      <button onClick={() => setRefresh((cr) => ++cr)}>Refresh</button>
      <div>
        <label>
          Your Name:
          <input
            name="Your name"
            value={name}
            onChange={(evt) => setName(evt.target.value)}
          />
        </label>
        <List refresh={refresh} name={name} />
      </div>
    </div>
  );
}

function List({ refresh, name }: { refresh: number; name: string }) {
  const [loading, setLoading] = useState(false);
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [error, setError] = useState('');

  useEffect(() => {
    async function load() {
      setLoading(true);

      try {
        const r = await axios.get<Photo[]>(`/api/photos?name=${name}`);
        setPhotos(r.data);
        setError('');
      } catch (e) {
        // eslint-disable-next-line
        setError(e.response.data.message);
      } finally {
        setLoading(false);
      }
    }

    // async function load() {
    //   setLoading(true);

    //   try {
    //     const r = await fetch(`/api/photos?name=${name}`);
    //     const json = await r.json();

    //     if (!r.ok) {
    //       throw new Error(json.message);
    //     }

    //     setPhotos(json);
    //     setError('');
    //   } catch (e) {
    //     setError(e.message);
    //   } finally {
    //     setLoading(false);
    //   }
    // }

    void load();
  }, [refresh, name]);

  return (
    <div>
      <div className={css.absolute}>
        {error ? <div className={css.error}>{error}</div> : null}
        {loading ? <div className={css.loading}>Loading...</div> : null}
      </div>

      {photos.map((photo) => (
        <PhotoDetail photo={photo} key={photo.id} />
      ))}
    </div>
  );
}

function PhotoDetail({ photo }: { photo: Photo }) {
  const [favourite, setFavourite] = useState(false);

  useEffect(() => {
    setFavourite(false);
  }, [photo]);

  return (
    <div className={css.listItem}>
      <img
        className={css.photo}
        src={photo.thumbnailUrl}
        aria-label={photo.title}
      />
      <div>
        <h2>{photo.title}</h2>
        <h3>PhotoId: {photo.id}</h3>

        <button
          onClick={() => {
            // we already have an example with .catch for this video :)
            void axios
              .post<Photo>('/api/favourite', { ...photo, favourite })
              .then((response) => {
                setFavourite(response.data.favourite);
              });
          }}
        >
          {favourite ? 'Remove from Favourites' : 'Add To Favourites'}
        </button>
      </div>
    </div>
  );
}
