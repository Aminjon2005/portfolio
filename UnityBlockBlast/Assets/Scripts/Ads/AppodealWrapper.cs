#if APPLOVIN_MREC || APPODEAL
#define AD_ENABLED
#endif

using System;
using UnityEngine;

namespace BlockBlast.Ads
{
    public enum AdPlacement
    {
        Interstitial,
        Rewarded,
        Banner
    }

    public class AppodealWrapper : MonoBehaviour
    {
#if AD_ENABLED
        // Replace with actual Appodeal SDK calls in Unity
#endif
        public static AppodealWrapper Instance { get; private set; }

        public event Action OnInterstitialClosed;
        public event Action<bool> OnRewardedClosed; // success

        [Header("Config")] public string appKeyAndroid;
        public string appKeyIOS;

        private void Awake()
        {
            if (Instance != null && Instance != this)
            {
                Destroy(gameObject);
                return;
            }
            Instance = this;
            DontDestroyOnLoad(gameObject);
        }

        private void Start()
        {
#if AD_ENABLED
            Initialize();
#endif
        }

        public void Initialize()
        {
#if AD_ENABLED
            // TODO: Call Appodeal.initialize(appKey,...)
            Debug.Log("[Appodeal] Initialized with compile-time flag AD_ENABLED");
#else
            Debug.Log("[Appodeal] SDK disabled (define symbols not set)");
#endif
        }

        public bool IsLoaded(AdPlacement placement)
        {
#if AD_ENABLED
            return true; // Replace with Appodeal.isLoaded
#else
            return false;
#endif
        }

        public void Show(AdPlacement placement)
        {
#if AD_ENABLED
            Debug.Log($"[Appodeal] Show {placement}");
            // Replace with Appodeal.show
            if (placement == AdPlacement.Rewarded)
            {
                // Simulate success
                OnRewardedClosed?.Invoke(true);
            }
            else
            {
                OnInterstitialClosed?.Invoke();
            }
#else
            Debug.Log($"[Appodeal] {placement} not available");
#endif
        }
    }
}
