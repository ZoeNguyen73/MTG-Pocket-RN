import { musicAssets } from "../constants/music";
import { soundAssets } from "../constants/sounds";
import { createAudioPlayer } from "expo-audio";

const DEFAULT_BG_TRACK_FILENAME = "Adventure_remaster";

// sound manager object to manage different states
export const soundManager = {
  // background music
  backgroundMusic: null,
  backgroundMusicFileName: null,
  backgroundMusicVolume: 1, 
  backgroundMusicPlaying: true,

  // sound effects
  soundEffectsVolume: 1,
  sfxPlayers: new Map(),
  sfxPolicy: "restart",

  // SOUND EFFECTs methods:
  getSoundEffectsVolume() {
    return this.soundEffectsVolume;
  },

  setSoundEffectsVolume(volume) {
    if (volume >= 0 && volume <= 1) {
      this.soundEffectsVolume = volume;
    } else {
      console.error("Volume must be between 0 and 1");
    }
  },

  playSfx(key, { volume, policy }={}) {
    try {
      const asset = soundAssets[key];
      if (!asset) {
        console.error(`SFX asset not found: ${key}`);
        return;
      }

      const finalPolicy = policy ?? this.sfxPolicy;
      
      // if policy = overlap (create new player each time)
      if (finalPolicy === "overlap") {
        const p = createAudioPlayer(asset);
        p.volume = volume ?? this.soundEffectsVolume;
        p.play();
        return;
      }

      // if policy = restart (stop the previous sound and reuse the player)
      let player = this.sfxPlayers.get(key);
      if (!player) {
        player = createAudioPlayer(asset);
        this.sfxPlayers.set(key, player);
      } else {
        // restart if it was already playing
        try { player.pause(); } catch (e) {}
      }

      player.volume = volume ?? this.soundEffectsVolume;
      player.seekTo(0);
      player.play();

    } catch (error) {
      console.error(`SFX player error: ${error}`);
    }
  },

  // stop 1 sfx player
  stopSfx(key) {
    const player = this.sfxPlayers.get(key);
    if (player) {
      try { player.pause(); } catch (e) {}
    }
  },

  // stop all sfx (eg. leaving a screen)
  stopAllSfx() {
    for (const player of this.sfxPlayers.values()) {
      try { player.pause(); } catch (e) {}
    }
  },

  // clear cache
  clearSfxCache() {
    this.stopAllSfx();
    this.sfxPlayers.clear();
  },

  // BACKGROUND MUSIC methods:
  async playBackgroundMusic(fileName) {
    const confirmedFileName = fileName ? fileName : DEFAULT_BG_TRACK_FILENAME;
    const confirmedTrack = musicAssets[confirmedFileName];

    if (!confirmedTrack) {
      console.error(`Music asset not found: ${confirmedFileName}`);
      return;
    }

    const filePath = confirmedTrack.path;

    try {
      // first time creation of background music
      if (!this.backgroundMusic) {

        this.backgroundMusic = createAudioPlayer(filePath);

        this.backgroundMusic.loop = true;
        this.backgroundMusic.volume = this.backgroundMusicVolume;

        this.backgroundMusicFileName = confirmedFileName;

      // switching background music files
      } else if (fileName && fileName !== this.backgroundMusicFileName) {
        this.backgroundMusic.replace(filePath);
        this.backgroundMusicFileName = confirmedFileName;

      }

      this.backgroundMusic.play();
      this.backgroundMusicPlaying = true;

      console.log("music play triggered");

    } catch (error) {
      console.error("Error playing background music:", error);
    }
  },

  // stop background music
  async stopBackgroundMusic() {
    if (this.backgroundMusic) {
      this.backgroundMusic.pause();
    }
    
    this.backgroundMusicPlaying = false;
    console.log("music stop triggered");
  },

  // change background music volume
  async setBackgroundMusicVolume(volume) {
    if (volume >= 0 && volume <= 1) {
      this.backgroundMusicVolume = volume;

      if (this.backgroundMusic) {
        this.backgroundMusic.volume = volume;
      }

    } else {
      console.error("Volume must be between 0 and 1");
    }
  },

};