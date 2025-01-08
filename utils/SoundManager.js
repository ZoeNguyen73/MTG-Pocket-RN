import { Audio } from "expo-av";

import { soundAssets } from "../constants/sounds";

const DEFAULT_BG_TRACK_FILENAME = "Adventure_remaster";

// export as an object to manage states
export const soundManager = {
  backgroundMusic: null,
  backgroundMusicFileName: null,
  backgroundMusicVolume: 1,
  soundEffectsVolume: 1, // Global sound effects volume
  backgroundMusicPlaying: true,

  // Methods to control sound effects volume
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

  // Background music methods
  async playBackgroundMusic(fileName) {
    const confirmedFileName = fileName ? fileName : DEFAULT_BG_TRACK_FILENAME;
    const confirmedTrack = soundAssets[confirmedFileName];

    const filePath = confirmedTrack.path;

    try {
      if (!this.backgroundMusic) {
        const { sound } = await Audio.Sound.createAsync(
          filePath,
          { shouldPlay: true, isLooping: true }
        );
        this.backgroundMusic = sound;
        this.backgroundMusicFileName = confirmedFileName;
      } else if (fileName && fileName !== this.backgroundMusicFileName) {
        await this.backgroundMusic.stopAsync();
        await this.backgroundMusic.unloadAsync();
        const { sound } = await Audio.Sound.createAsync(
          filePath,
          { shouldPlay: true, isLooping: true }
        );
        this.backgroundMusic = sound;
        this.backgroundMusicFileName = fileName;
      }

      await this.backgroundMusic.setVolumeAsync(this.backgroundMusicVolume);
      await this.backgroundMusic.playAsync();
      this.backgroundMusicPlaying = true;
      console.log("music play triggered");
    } catch (error) {
      console.error("Error playing background music:", error);
    }
  },

  // stop music with an option to unload
  async stopBackgroundMusic(unload = false) {
    if (this.backgroundMusic) {
      await this.backgroundMusic.stopAsync();
      if (unload) {
        await this.backgroundMusic.unloadAsync();
        this.backgroundMusic = null;
        this.backgroundMusicFileName = null;
      }
    }
    console.log("music stop triggered");
    this.backgroundMusicPlaying = false;
  },

  async setBackgroundMusicVolume(volume) {
    if (volume >= 0 && volume <= 1) {
      this.backgroundMusicVolume = volume;
      if (this.backgroundMusic) {
        await this.backgroundMusic.setVolumeAsync(volume);
      }
    } else {
      console.error("Volume must be between 0 and 1");
    }
  },

};