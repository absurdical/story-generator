'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import imageLists from '../data/imagelists.json';

function getRandomChoices(arr: string[], count: number) {
  const shuffled = [...arr].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
}

export default function Home() {
  const [adultMode, setAdultMode] = useState(false);
  const [authRequested, setAuthRequested] = useState(false);
  const [authCode, setAuthCode] = useState('');
  const [authError, setAuthError] = useState(false);

  const [people, setPeople] = useState<string[]>([]);
  const [places, setPlaces] = useState<string[]>([]);
  const [things, setThings] = useState<string[]>([]);

  const [selectedStoryType, setSelectedStoryType] = useState<string | null>(null);
  const [selectedPerson, setSelectedPerson] = useState<string | null>(null);
  const [selectedPlace, setSelectedPlace] = useState<string | null>(null);
  const [selectedThing, setSelectedThing] = useState<string | null>(null);

  const [storyParts, setStoryParts] = useState<string[]>([]);
  const [actNumber, setActNumber] = useState(1);
  const [loading, setLoading] = useState(false);

  const mode = adultMode ? 'adult' : 'kids';
  const modeFolder = adultMode ? 'adult_mode' : 'kid_mode';

  const storyTypes = ['Fairytale', 'Mystery', 'Adventure', 'Sci-Fi'];

  const reshuffle = () => {
    setPeople(getRandomChoices(imageLists[mode].people, 5));
    setPlaces(getRandomChoices(imageLists[mode].places, 5));
    setThings(getRandomChoices(imageLists[mode].things, 5));
    setSelectedPerson(null);
    setSelectedPlace(null);
    setSelectedThing(null);
  };

  useEffect(() => {
    reshuffle();
  }, [adultMode]);

  const handleAdultToggle = () => {
    if (!adultMode) {
      setAuthRequested(true);
      setAuthCode('');
      setAuthError(false);
    } else {
      setAdultMode(false);
    }
  };

  const handleAuthSubmit = () => {
    const validCode = '23858';
    if (authCode === validCode) {
      setAdultMode(true);
      setAuthRequested(false);
      setAuthError(false);
    } else {
      setAuthError(true);
    }
  };

  const generateStory = async () => {
    if (actNumber > 3) {
      setStoryParts([]);
      setActNumber(1);
      reshuffle();
      setSelectedStoryType(null);
      return;
    }

    if (!selectedStoryType || !selectedPerson || !selectedPlace || !selectedThing) {
      alert('Please select a story type, person, place, and thing.');
      return;
    }

    setLoading(true);

    const res = await fetch('/api/story', {
      method: 'POST',
      body: JSON.stringify({
        storyType: selectedStoryType,
        person: selectedPerson,
        place: selectedPlace,
        thing: selectedThing,
        previous: storyParts.join('\n\n'),
        mode,
        actNumber,
      }),
    });

    const data = await res.json();
    setStoryParts([...storyParts, data.story]);
    setLoading(false);

    if (actNumber < 3) {
      setActNumber(actNumber + 1);
      reshuffle();
      setSelectedPerson(null);
      setSelectedPlace(null);
      setSelectedThing(null);
    } else {
      setActNumber(4);
    }
  };

  return (
    <main
      style={{
        padding: '2rem',
        fontFamily: `'Comic Sans MS', 'Segoe UI', sans-serif`,
        backgroundColor: '#f7f7fb',
        minHeight: '100vh',
        maxWidth: '1200px',
        margin: '0 auto',
      }}
    >
      <h1
        style={{
          textAlign: 'center',
          fontSize: '2rem',
          color: '#333',
          marginBottom: '1rem',
        }}
      >
        Choose Your Own Adventure
      </h1>

      <section style={{ marginBottom: '2rem', textAlign: 'center' }}>
        <button
          onClick={handleAdultToggle}
          style={{
            padding: '0.5rem 1rem',
            backgroundColor: adultMode ? '#f39c12' : '#3498db',
            color: '#fff',
            border: 'none',
            borderRadius: '20px',
            cursor: 'pointer',
          }}
        >
          Toggle Adult Mode ({adultMode ? 'ON' : 'OFF'})
        </button>
      </section>

      {authRequested && (
        <div style={{ marginTop: '2rem', textAlign: 'center' }}>
          <h3>Enter Passcode to Unlock Adult Mode</h3>
          <input
            type="password"
            value={authCode}
            onChange={(e) => setAuthCode(e.target.value)}
            style={{ padding: '0.5rem', borderRadius: '6px', border: '1px solid #ccc' }}
          />
          <button
            onClick={handleAuthSubmit}
            style={{
              marginLeft: '1rem',
              padding: '0.5rem 1rem',
              backgroundColor: '#0070f3',
              color: '#fff',
              border: 'none',
              borderRadius: '6px',
              cursor: 'pointer',
            }}
          >
            Submit
          </button>
          {authError && <p style={{ color: 'red' }}>Incorrect code. Try again.</p>}
        </div>
      )}

      <section style={{ marginBottom: '2rem', textAlign: 'center' }}>
        <h2 style={{ fontSize: '1.25rem', color: '#555' }}>Story Type</h2>
        <div
          style={{
            display: 'flex',
            gap: '1rem',
            flexWrap: 'wrap',
            justifyContent: 'center',
            marginTop: '0.5rem',
            maxWidth: '1000px',
            marginLeft: 'auto',
            marginRight: 'auto',
          }}
        >
          {storyTypes.map((type) => (
            <button
              key={type}
              onClick={() => setSelectedStoryType(type)}
              style={{
                padding: '0.5rem 1rem',
                backgroundColor: selectedStoryType === type ? '#0070f3' : '#fff',
                color: selectedStoryType === type ? '#fff' : '#333',
                border: '2px solid #ccc',
                borderRadius: '20px',
                cursor: 'pointer',
                boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
              }}
            >
              {type}
            </button>
          ))}
        </div>
      </section>

      <CategorySection
        title="People"
        items={people}
        selected={selectedPerson}
        onSelect={setSelectedPerson}
        modeFolder={modeFolder}
      />
      <CategorySection
        title="Places"
        items={places}
        selected={selectedPlace}
        onSelect={setSelectedPlace}
        modeFolder={modeFolder}
      />
      <CategorySection
        title="Things"
        items={things}
        selected={selectedThing}
        onSelect={setSelectedThing}
        modeFolder={modeFolder}
      />

      <section style={{ marginTop: '2rem', textAlign: 'center' }}>
        <button
          onClick={generateStory}
          disabled={loading}
          style={{
            margin: '1rem',
            padding: '0.75rem 1.5rem',
            fontSize: '1rem',
            backgroundColor: '#28a745',
            color: '#fff',
            border: 'none',
            borderRadius: '20px',
            cursor: 'pointer',
          }}
        >
          {loading
            ? 'Generating…'
            : actNumber === 1
            ? 'Start Story'
            : actNumber === 2
            ? 'Act II'
            : actNumber === 3
            ? 'Act III'
            : 'Create New Story'}
        </button>
      </section>

      {storyParts.length > 0 && (
        <section
          style={{
            maxWidth: '800px',
            margin: '2rem auto',
            background: '#fff',
            padding: '1rem',
            borderRadius: '8px',
            boxShadow: '0 2px 5px rgba(0,0,0,0.1)',
          }}
        >
          {storyParts.map((part, idx) => (
            <p key={idx} style={{ whiteSpace: 'pre-wrap' }}>
              {part}
            </p>
          ))}
        </section>
      )}
    </main>
  );
}

function CategorySection({
  title,
  items,
  selected,
  onSelect,
  modeFolder,
}: {
  title: string;
  items: string[];
  selected: string | null;
  onSelect: (val: string) => void;
  modeFolder: string;
}) {
  const formatName = (filename: string) => {
    return filename
      .replace('.png', '')
      .replace(/_/g, ' ')
      .split(' ')
      .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
      .join(' ');
  };

  return (
    <section style={{ marginBottom: '2rem', textAlign: 'center' }}>
      <h2 style={{ fontSize: '1.25rem', color: '#555' }}>{title}</h2>
      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          justifyContent: 'center',
          gap: '1rem',
          marginTop: '1rem',
          maxWidth: '1000px',
          marginLeft: 'auto',
          marginRight: 'auto',
        }}
      >
        {items.map((img) => (
          <div
            key={img}
            onClick={() => onSelect(img)}
            style={{
              width: '100px',
              textAlign: 'center',
              cursor: 'pointer',
            }}
          >
            <div
              style={{
                width: '100px',
                height: '100px',
                border:
                  selected === img ? '3px solid #0070f3' : '1px solid #ddd',
                borderRadius: '12px',
                overflow: 'hidden',
                boxShadow:
                  selected === img
                    ? '0 0 6px rgba(0,112,243,0.5)'
                    : '0 1px 3px rgba(0,0,0,0.1)',
                backgroundColor: '#fff',
                marginBottom: '0.25rem',
              }}
            >
              <Image
                src={`/images/${modeFolder}/${img}`}
                alt={img}
                width={100}
                height={100}
                style={{ objectFit: 'cover' }}
              />
            </div>
            <div
              style={{
                fontSize: '0.8rem',
                color: '#333',
                wordWrap: 'break-word',
                maxWidth: '100px',
              }}
            >
              {formatName(img)}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
