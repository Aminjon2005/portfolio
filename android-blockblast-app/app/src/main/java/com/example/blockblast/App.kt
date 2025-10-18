package com.example.blockblast

import android.app.Application
import com.appodeal.ads.Appodeal
import com.appodeal.ads.utils.Log

class App : Application() {
    override fun onCreate() {
        super.onCreate()
        // Replace with your actual Appodeal App Key
        val appKey = "APP_KEY_HERE"
        Log.setLogLevel(Log.LogLevel.verbose)
        Appodeal.initialize(this, appKey, Appodeal.BANNER or Appodeal.INTERSTITIAL)
    }
}
