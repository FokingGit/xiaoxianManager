package com.xiaoxianmanager;

import android.widget.Toast;

import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;


public class NativeUtilModule extends ReactContextBaseJavaModule {

    private final ReactApplicationContext reactContext;

    public NativeUtilModule(ReactApplicationContext reactContext) {
        super(reactContext);
        this.reactContext = reactContext;
    }

    @Override
    public String getName() {
        return this.getClass().getSimpleName();
    }

    @ReactMethod
    public void showToast(String content) {
        Toast.makeText(reactContext, content, Toast.LENGTH_SHORT).show();
    }

}
