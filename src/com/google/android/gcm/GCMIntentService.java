package com.google.android.gcm;

import com.google.android.gcm.*;
import com.ibs.phonegaptest.*;

import org.json.JSONException;
import org.json.JSONObject;

import android.app.Notification;
import android.app.NotificationManager;
import android.app.PendingIntent;
import android.content.Context;
import android.content.Intent;
import android.os.Bundle;
import android.util.Log;
import com.plugin.GCM.PushPlugin;


public class GCMIntentService extends GCMBaseIntentService {

  public static final String ME="GCMReceiver";

  public GCMIntentService() {
    super("GCMIntentService");
  }
  private static final String TAG = "GCMIntentService";

  @Override
  public void onRegistered(Context context, String regId) {

    Log.v(ME + ":onRegistered", "Registration ID arrived!");
    Log.v(ME + ":onRegistered", regId);

    JSONObject json;

    try
    {
      json = new JSONObject().put("event", "registered");
      json.put("regid", regId);

      Log.v(ME + ":onRegisterd", json.toString());

      // Send this JSON data to the JavaScript application above EVENT should be set to the msg type
      // In this case this is the registration ID
      PushPlugin.sendJavascript( json );

    }
    catch( JSONException e)
    {
      // No message to the user is sent, JSON failed
      Log.e(ME + ":onRegisterd", "JSON exception");
    }
  }

  @Override
  public void onUnregistered(Context context, String regId) {
    Log.d(TAG, "onUnregistered - regId: " + regId);
  }

  @SuppressWarnings("deprecation")
@Override
  protected void onMessage(Context context, Intent intent) {
    Log.d(TAG, "onMessage - context: " + context);

        
    String MyMessage="";
    
    // Extract the payload from the message
    Bundle extras = intent.getExtras();
    if (extras != null) {
      try
      {
        JSONObject json;
        json = new JSONObject().put("event", "message");

        // My application on my host server sends back to "EXTRAS" variables message and msgcnt
        // Depending on how you build your server app you can specify what variables you want to send
        //
        
        MyMessage = extras.getString("msg");
        json.put("message", MyMessage);
        
        //Log.v("INHALT::", extras.getString("message"));
        Log.v(ME + ":onMessage", json.toString()); // <<< starten und bitte zeig mir was dort im log dann steht

        PushPlugin.sendJavascript( json );
        // Send the MESSAGE to the Javascript application
      }
      catch( JSONException e)
      {
        Log.e(ME + ":onMessage", "JSON exception");
      }        	
    }
    				
	String ns = Context.NOTIFICATION_SERVICE;
	NotificationManager mNM = (NotificationManager) getSystemService(ns);

	// Set the icon, scrolling text and timestamp
	@SuppressWarnings("deprecation")
	Notification notification = new Notification(com.ibs.phonegaptest.R.drawable.dmkico,
			"DMK Labor: Neue Daten", System.currentTimeMillis());

	Intent notificationIntent = new Intent(this, MainActivity.class);
	notificationIntent.putExtra("notifyStart", 1);
	
	try {
		
		// Intent notificationIntent = getPackageManager().getLaunchIntentForPackage("mobione.mpr");
		PendingIntent contentIntent = PendingIntent.getActivity(this, 0,notificationIntent, 0);
	
		// Set the info for the views that show in the notification panel.
		notification.setLatestEventInfo(this, "DMK Message",MyMessage, contentIntent);
		notification.defaults=Notification.DEFAULT_SOUND;
		notification.flags =  Notification.FLAG_AUTO_CANCEL | Notification.FLAG_SHOW_LIGHTS;

		// Send the notification.
		mNM.notify(34130, notification);
	
	} catch (Exception e){
	
} 
   
    
  }

  @Override
  public void onError(Context context, String errorId) {
    Log.e(TAG, "onError - errorId: " + errorId);
  }

}
