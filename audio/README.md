# Audio Files for Lucky Draw

## Required Files

Place these audio files in `public/audio/` folder:

1. **background.mp3** - Background music (looping)
2. **clap.mp3** - Clap/applause sound (5 seconds)

## Where to get audio:

### Option 1: Free Sound Libraries
- https://freesound.org/
- https://www.zapsplat.com/
- https://mixkit.co/free-sound-effects/

### Option 2: Download from YouTube
Use a YouTube to MP3 converter:
- https://ytmp3.nu/
- https://y2mate.com/

Your videos:
- Background: https://www.youtube.com/watch?v=T79FDHHT2AI
- Clap: https://www.youtube.com/watch?v=barWV7RWkq0

## File Structure

```
public/
  audio/
    background.mp3
    clap.mp3
```

## After adding files

Uncomment these lines in LuckyDraw.jsx:
```javascript
backgroundAudioRef.current.src = '/audio/background.mp3';
clapAudioRef.current.src = '/audio/clap.mp3';
```
