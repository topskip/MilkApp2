package com.ibs.phonegaptest;

import android.R;
import android.os.Bundle;
import android.telephony.TelephonyManager;
import android.util.Log;
import android.widget.Toast;
import android.app.Activity;
import android.content.Context;
import android.content.Intent;
import android.content.SharedPreferences;

import org.apache.cordova.*;

import com.google.android.gcm.*;

public class MainActivity extends DroidGap {

    @Override
    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        
        //super.setIntegerProperty("splashscreen", R.drawable.splash);
        
        // get IMEI
        TelephonyManager tm = (TelephonyManager) getSystemService(Context.TELEPHONY_SERVICE);
        String imei = tm.getDeviceId();
        
        Intent intent = this.getIntent();
        int startMode = intent.getIntExtra("notifyStart", 0);
        if (startMode==1) {
        	super.loadUrl("file:///android_asset/www/index2.html?notifyStart="+startMode+"&imei="+imei);
        } else {
        	super.loadUrl("file:///android_asset/www/index2.html?notifyStart="+startMode+"&imei="+imei,3000);	
        }

    }
}
