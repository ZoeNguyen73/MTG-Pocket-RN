import { Audio } from "expo-av";

import { musicAssets } from "../constants/music";
import { createAudioPlayer } from "expo-audio";

const DEFAULT_BG_TRACK_FILENAME = "Adventure_remaster";

// sound manager object to manage different states
export const soundManager = {
  backgroundMusic: null,
  backgroundMusicFileName: null,
  backgroundMusicVolume: 1, 
  soundEffectsVolume: 1, 
  backgroundMusicPlaying: true,

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
        // const { sound } = await Audio.Sound.createAsync(
        //   filePath,
        //   { shouldPlay: true, isLooping: true }
        // );
        // this.backgroundMusic = sound;
        // this.backgroundMusicFileName = confirmedFileName;

        this.backgroundMusic = createAudioPlayer(filePath);

        this.backgroundMusic.loop = true;
        this.backgroundMusic.volume = this.backgroundMusicVolume;

        this.backgroundMusicFileName = confirmedFileName;

      // switching background music files
      } else if (fileName && fileName !== this.backgroundMusicFileName) {
        // await this.backgroundMusic.stopAsync();
        // await this.backgroundMusic.unloadAsync();
        // const { sound } = await Audio.Sound.createAsync(
        //   filePath,
        //   { shouldPlay: true, isLooping: true }
        // );
        // this.backgroundMusic = sound;
        // this.backgroundMusicFileName = fileName;
        this.backgroundMusic.replace(filePath);
        this.backgroundMusicFileName = confirmedFileName;

      }

      // await this.backgroundMusic.setVolumeAsync(this.backgroundMusicVolume);
      // await this.backgroundMusic.playAsync();
      // this.backgroundMusicPlaying = true;

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
      // await this.backgroundMusic.stopAsync();
      // if (unload) {
      //   await this.backgroundMusic.unloadAsync();
      //   this.backgroundMusic = null;
      //   this.backgroundMusicFileName = null;
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