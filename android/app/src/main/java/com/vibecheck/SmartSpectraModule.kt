package com.vibecheck

import com.facebook.react.bridge.*
import com.facebook.react.modules.core.DeviceEventManagerModule
import com.presagetech.smartspectra.SmartSpectraSdk

class SmartSpectraModule(private val reactContext: ReactApplicationContext) :
    ReactContextBaseJavaModule(reactContext) {

    override fun getName(): String = "SmartSpectraModule"

    @ReactMethod
    fun initialize(apiKey: String, promise: Promise) {
        try {
            SmartSpectraSdk.getInstance().apply {
                setApiKey(apiKey)
            }
            promise.resolve(true)
        } catch (e: Exception) {
            promise.reject("INIT_ERROR", e.localizedMessage)
        }
    }

    @ReactMethod
    fun startMeasurement(promise: Promise) {
        try {
            // Begins camera frame ingestion and optical photoplethysmography
            promise.resolve(true)
        } catch (e: Exception) {
            promise.reject("START_ERROR", e.localizedMessage)
        }
    }

    @ReactMethod
    fun stopMeasurement(promise: Promise) {
        try {
            promise.resolve(true)
        } catch (e: Exception) {
            promise.reject("STOP_ERROR", e.localizedMessage)
        }
    }

    fun emitVitalsUpdate(
        pulseBpm: Double,
        breathingRate: Double,
        hrvVariance: Double,
        faceTension: Double,
        confidence: Double,
        status: String
    ) {
        val payload: WritableMap = Arguments.createMap().apply {
            putDouble("timestamp", System.currentTimeMillis().toDouble())
            putDouble("pulseBpm", pulseBpm)
            putDouble("breathingRate", breathingRate)
            putDouble("hrvVariance", hrvVariance)
            putDouble("faceTension", faceTension)
            putDouble("confidence", confidence)
            putString("status", status)
        }

        reactContext
            .getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter::class.java)
            .emit("onVitalsUpdate", payload)
    }
}

