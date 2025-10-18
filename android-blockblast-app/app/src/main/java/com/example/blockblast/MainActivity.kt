package com.example.blockblast

import android.os.Bundle
import androidx.appcompat.app.AppCompatActivity
import com.example.blockblast.databinding.ActivityMainBinding
import com.appodeal.ads.Appodeal
import com.appodeal.ads.BannerView
import com.appodeal.ads.InterstitialCallbacks

class MainActivity : AppCompatActivity() {
    private lateinit var binding: ActivityMainBinding

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        binding = ActivityMainBinding.inflate(layoutInflater)
        setContentView(binding.root)

        setupBanner()
        setupGameCallbacks()
    }

    private fun setupBanner() {
        val bannerView = Appodeal.getBannerView(this)
        binding.bannerContainer.addView(bannerView)
        Appodeal.show(this, Appodeal.BANNER_VIEW)
    }

    private fun setupGameCallbacks() {
        binding.gameView.onScoreChanged = { score ->
            binding.scoreText.text = "Score: $score"
        }
        binding.gameView.onGameOver = {
            Appodeal.setInterstitialCallbacks(object : InterstitialCallbacks {
                override fun onInterstitialLoaded(isPrecache: Boolean) {}
                override fun onInterstitialFailedToLoad() {}
                override fun onInterstitialShown() {}
                override fun onInterstitialShowFailed() {}
                override fun onInterstitialClicked() {}
                override fun onInterstitialClosed() {}
                override fun onInterstitialExpired() {}
            })
            if (Appodeal.isLoaded(Appodeal.INTERSTITIAL)) {
                Appodeal.show(this, Appodeal.INTERSTITIAL)
            } else {
                Appodeal.cache(this, Appodeal.INTERSTITIAL)
            }
        }
    }
}
