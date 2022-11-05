import { useEffect, useState } from 'react';
import { MemoryRouter as Router, Routes, Route } from 'react-router-dom';
import icon from '../../assets/icon.svg';
import './App.css';

const Hello = () => {
  const [faceState, setFaceState] = useState({
    face: '🤪',
    state: 'setting',
  });
  const [faces, setFaces] = useState<
    {
      id: number;
      emoji: string;
      location: string;
    }[]
  >([
    { id: 1, emoji: '🤪', location: '' },
    { id: 2, emoji: '🤩', location: '' },
    { id: 3, emoji: '🤓', location: '' },
    { id: 4, emoji: '🤠', location: '' },
    { id: 5, emoji: '🙂', location: '' },
  ]);

  useEffect(() => {
    // facesが全てlocationが設定されたらstateを'complete'にする
    if (faces.every((face) => face.location !== '')) {
      setFaceState({ ...faceState, state: 'complete' });
    }
  }, [faceState, faces]);

  return (
    <div>
      {faceState.state === 'setting' && (
        <>
          <h1>setup your face image</h1>

          <div className="face-list">
            {faces.map((face) => (
              // クリックされた顔の画像のlocalURLを設定する
              // 特定のfacesに対して、locationを設定する。
              <div key={face.id} className="face">
                <p>{face.emoji}</p>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    if (e.target.files) {
                      const file = e.target.files[0];
                      const reader = new FileReader();
                      reader.onload = (e2) => {
                        if (e2.target) {
                          const localURL = e2.target.result;
                        }
                      };
                      // 特定のfacesに対して、locationを設定する。
                      console.log(file.path);
                      setFaces((prev) => {
                        return prev.map((f) => {
                          if (f.id === face.id) {
                            return { ...f, location: file.path };
                          }
                          return f;
                        });
                      });
                    }
                  }}
                />
              </div>
            ))}
          </div>
        </>
      )}
      {faceState.state === 'complete' && (
        <>
          <div
            style={{
              display: 'grid',
              gridTemplateRows: '1fr 32px',
              width: '100%',
              height: '100vh',
            }}
          >
            <div
              style={{
                // background Image にfaceState.faceと同じfacesのemojiと該当するobjectのlocationを設定する
                backgroundImage: `url(file://${
                  faces.find((face) => face.emoji === faceState.face)?.location
                })`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                backgroundRepeat: 'no-repeat',
              }}
            />
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(5, 1fr)',
                gridGap: '8px',
                padding: '8px',
              }}
            >
              {faces.map((face) => (
                <button
                  type="button"
                  key={face.id}
                  onClick={() =>
                    setFaceState({ face: face.emoji, state: 'complete' })
                  }
                >
                  {face.emoji}
                </button>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
};
export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Hello />} />
      </Routes>
    </Router>
  );
}
