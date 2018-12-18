package com.mm.formsz.CustomPlugins.SyncutilityPlugin;

import android.database.Cursor;
import android.database.sqlite.SQLiteDatabase;
import android.util.Log;
import android.widget.Toast;

//import com.mm.formsz.tpcl.R;

import com.mm.formsz.tpcl.R;

import org.apache.cordova.CallbackContext;
import org.apache.cordova.CordovaInterface;
import org.apache.cordova.CordovaPlugin;
import org.apache.cordova.CordovaWebView;
import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;
import org.json.JSONTokener;

import java.io.File;
import java.io.IOException;
import java.net.URI;
import java.text.DateFormat;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.HashMap;
import java.util.Hashtable;
import java.util.Locale;
import java.util.TimeZone;

import okhttp3.Call;
import okhttp3.Callback;
import okhttp3.MediaType;
import okhttp3.MultipartBody;
import okhttp3.OkHttpClient;
import okhttp3.Request;
import okhttp3.RequestBody;
import okhttp3.Response;

import static java.lang.System.exit;


/**
 * Created by Manish on 20-02-2018.
 */

public class SyncUtilityPlugin extends CordovaPlugin {

  private  String dbPath=null ;
  SQLiteDatabase db = null;
  private static final String dbTableQuery="SELECT * FROM FormData_table where FormStatus='saved'";
  private static boolean isSyncInProgress;
  private static int totalRecs,succesfulRecs,failedRecs;
  private static  HashMap<String,Object> params;
  private static  JSONArray resultsIDs=new JSONArray();
  private static Hashtable geeneratedIds=new Hashtable();

  // private int i=0;

  @Override
  public void initialize(CordovaInterface cordova, CordovaWebView webView) {
    /*Method which initializes the plugin variables
    * */
    super.initialize(cordova, webView);
    //  Log.d("reset initialzation","*****");
    dbPath = getDatabasePath();
    getHandleOnDatabase();
    resetCounters();
  }
  private void resetCounters(){
    /*Method which resets parameters used during the sync process
    * */
    //Log.d("reset count",String.valueOf(++i));
    Log.d("resetting sync","*********");
    isSyncInProgress=false;
    totalRecs=succesfulRecs=failedRecs=0;
    params=new HashMap<String, Object>();
    resultsIDs=new JSONArray();

  }

  private String getDatabasePath(){
    /*Method which returns the Formz db path.Formz uses internal memory.
    * */
    String path=cordova.getActivity().getFilesDir().getParent();
    return path+"/databases/OfflineDB.db";

  }
  private void getHandleOnDatabase(){
    /*Method open the DB for read/write purpose
    * */
    db = SQLiteDatabase.openOrCreateDatabase(dbPath, null);
    db.enableWriteAheadLogging();
  }
  private void checkForCompletion(CallbackContext callbackContext){
    /*Method which keeps track of the sync process and show alert to user on completion;
    * */
    if(totalRecs==succesfulRecs+failedRecs) {
      showMessage(String.format(cordova.getActivity().getResources().getString(R.string.sync_completed), succesfulRecs, failedRecs));
      callbackContext.success(resultsIDs);
      resetCounters();

    }

  }

  private void syncTaskData(JSONArray args, CallbackContext callbackContext){
    /*Method responsible to sync task data
    * */
    sendDataRequest(fetchData(parseInputData(args, 1),1),callbackContext);
  }
  private void syncFormData(JSONArray args, CallbackContext callbackContext){
    /*Method responsible to sync form data
    * */
    sendDataRequest(fetchData(parseInputData(args, 2),2), callbackContext);
  }
  private void syncRecordData(JSONArray args, CallbackContext callbackContext){
    /*Method responsible to sync record  data
    * */
    sendDataRequest(fetchData(parseInputData(args,3),3), callbackContext);
  }
  private void syncVideoData(JSONArray args, CallbackContext callbackContext){
    //sendVideoRequest(fetchData(parseInputData(args,3),3), callbackContext);
    sendMultipleVideoRequest(fetchData(parseInputData(args,3),3), callbackContext);
  }

  //  private void sendVideoRequest(Cursor cur, final CallbackContext callbackContext){
//    /*method responsible for sending the videos to mobile server.request calling is asynchronous in nature.
//    * */
//    OkHttpClient client = new OkHttpClient();
//    MediaType  MEDIA_TYPE_PNG = MediaType.parse("video/mp4");
//    totalRecs=0;
//    succesfulRecs=failedRecs=0;
//    if(cur!=null&&cur.moveToFirst()){
//      do {
//        System.out.println(".........");
//                System.out.println(cur.getColumnIndex("isVideoAvailable"));
//                System.out.println(cur.getColumnIndex("videoPath"));
//
//        final String uniqueID=cur.getString(cur.getColumnIndex("uniqueID"));
//        if (cur.getColumnIndex("isVideoAvailable")==-1 || cur.getColumnIndex("videoPath")==-1 || cur.getString(cur.getColumnIndex("isVideoAvailable"))==null || !cur.getString(cur.getColumnIndex("isVideoAvailable")).equals("true")||(cur.getString(cur.getColumnIndex("videoPath"))==null||cur.getString(cur.getColumnIndex("videoPath")).length()==0)){
//          resultsIDs.put(uniqueID);
//          continue;
//
//        }
//        totalRecs+=1;
//        JSONObject rec=null;
//        Log.d("cursor *****", cur.getColumnCount()+"");
//        Log.d("cursor index *****", cur.getString(cur.getColumnIndex("videoOptions")));
//
//        try {
//          rec= ((JSONObject) new JSONTokener(cur.getString(cur.getColumnIndex("videoOptions"))).nextValue());
//          Log.d("rec ***** ", rec.toString());
//        } catch (JSONException e) {
//          e.printStackTrace();
//        }
//        RequestBody  requestBody = null;
//        try {
//          requestBody = new MultipartBody.Builder()
//            .setType(MultipartBody.FORM)
//            .addFormDataPart("fileKey", rec.getString("fileKey").toString())
//            .addFormDataPart("video", rec.getString("fileName").toString(),
//              RequestBody.create(MEDIA_TYPE_PNG, new File(URI.create(cur.getString(cur.getColumnIndex("videoPath"))))))
//            .build();
//        } catch (JSONException e) {
//          e.printStackTrace();
//        }
//        Request request = new Request.Builder()
//          .url(params.get("URI")+"/api/v1/gridFS/addvideo/"+geeneratedIds.get(uniqueID))
//          .post(requestBody)
//          .build();
//        client.newCall(request).enqueue(new Callback() {
//          @Override
//          public void onFailure(Call call, IOException e) {
//            Log.d("video request failed **", e.getMessage());
//            failedRecs+=1;
//            checkForCompletion(callbackContext);
//          }
//
//          @Override
//          public void onResponse(Call call, Response response) throws IOException {
//            if(response.code()==200){
  //        Log.d("video request success *", response.body().string());
//              succesfulRecs+=1;
//              resultsIDs.put(uniqueID);
//            }
//            else{
//              failedRecs+=1;
//            }
//
//            checkForCompletion(callbackContext);
//          }
//        });
//      }while(cur.moveToNext());
//    }
//    if(cur!=null){
//      cur.close();
//    }
//    if(totalRecs==0){
//      checkForCompletion(callbackContext);
//    }
//
//  }
//
  private void sendMultipleVideoRequest(Cursor cur, final CallbackContext callbackContext){
//    /*method responsible for sending the videos to mobile server.request calling is asynchronous in nature.
//    * */
    OkHttpClient client = new OkHttpClient();
    MediaType  MEDIA_TYPE_PNG = MediaType.parse("video/mp4");
    totalRecs=0;
    succesfulRecs=failedRecs=0;
    if(cur!=null&&cur.moveToFirst()){
      Log.d("cursor count ***", cur.getCount()+"");
      do {
    //    Log.d("video array 11 ", (cur.getString(cur.getColumnIndex("isVideoAvailable"))));
   //     Log.d("video array 22 ", String.valueOf("videoOptions"));
        final String uniqueID=cur.getString(cur.getColumnIndex("uniqueID"));
        if (cur.getString(cur.getColumnIndex("isVideoAvailable"))==null){
          Log.d("second loopppp",".... entered");
          resultsIDs.put(uniqueID);
          continue;

        }
        JSONArray videosData = null;
        try {
          videosData = new JSONArray(cur.getString(cur.getColumnIndex("videoOptions")));

        } catch (JSONException e) {
          Log.d("errorrr$$$","newwwww err");
          e.printStackTrace();
        }
        if (cur.getString(cur.getColumnIndex("isVideoAvailable")).equals("true") && videosData.length()==0){
          Log.d("first loopppp","yes entered");
          resultsIDs.put(uniqueID);
          continue;

        }

        /* if (cur.getColumnIndex("isVideoAvailable")==-1 || cur.getColumnIndex("videoOptions")==-1 || cur.getString(cur.getColumnIndex("isVideoAvailable"))==null || !cur.getString(cur.getColumnIndex("isVideoAvailable")).equals("true")||(cur.getString(cur.getColumnIndex("videoOptions"))==null||cur.getString(cur.getColumnIndex("videoOptions")).length()==0)){
          resultsIDs.put(uniqueID);
          continue;
        }*/
        totalRecs+=1;
        JSONArray videoOptions=null;
        try {
          videoOptions= ((JSONArray) new JSONTokener(cur.getString(cur.getColumnIndex("videoOptions"))).nextValue());
          //        Log.d("video options ***** ", videoOptions.toString());
          //      Log.d("length ***** ", videoOptions.length()+"");
        } catch (JSONException e) {
          e.printStackTrace();
        }
        if(videoOptions != null) {
          for (int i=0; i<videoOptions.length();i++) {

            JSONObject rec = null;
            try {
              //         Log.d("it is try","tryyyyy*****");
              rec = videoOptions.getJSONObject(i);
            } catch (JSONException e) {
              //        Log.d("catchhhh","&&&&");
              e.printStackTrace();
            }
            //         Log.d("this is record", String.valueOf(rec));
            if(rec != null) {

              JSONObject options = null;
              try {
                options = rec.getJSONObject("options");
                //         Log.d("options of videos ***", rec.getJSONObject("options").toString());
              } catch (JSONException e) {
                e.printStackTrace();
              }
              //          Log.d("optionsssssss",options.toString());
              if (options != null) {

                RequestBody requestBody = null;
                try {
                  requestBody = new MultipartBody.Builder()
                          .setType(MultipartBody.FORM)
                          .addFormDataPart("fileKey", options.getString("fileKey"))
                          .addFormDataPart("params", options.getString("params"))

                          .addFormDataPart("video", options.getString("fileName"),

                                  RequestBody.create(MEDIA_TYPE_PNG, new File(rec.getString("path"))))
                          .build();
                } catch (JSONException e) {
                  e.printStackTrace();
                }
                //          Log.d("Generated ids", String.valueOf(geeneratedIds.get(uniqueID)));
                Request request = new Request.Builder()
                        .url(params.get("URI") + "/api/v1/gridFS/addvideo/" + geeneratedIds.get(uniqueID))
                        .post(requestBody)
                        .build();
                client.newCall(request).enqueue(new Callback() {
                  @Override
                  public void onFailure(Call call, IOException e) {
                    //           Log.d("video request failed **", e.getMessage());
                    failedRecs += 1;
                    //       isSyncInProgress=false;
                    checkForCompletion(callbackContext);
                  }

                  @Override
                  public void onResponse(Call call, Response response) throws IOException {
                    if (response.code() == 200) {
                      //              Log.d("video request success *", response.body().string());
                      succesfulRecs += 1;
                      resultsIDs.put(uniqueID);
                    } else {
                      failedRecs += 1;
                    }

                    checkForCompletion(callbackContext);
                  }
                });
              }
            }
          }//for loop ends
        }
      }while(cur.moveToNext());
    }
    if(cur!=null){
      cur.close();
    }
    if(totalRecs==0){
      checkForCompletion(callbackContext);
    }

  }

  private void sendDataRequest(Cursor cur, final CallbackContext callbackContext){
    Log.d("method entered", "method");
    /* method responsible for sending the request to mobile server.request calling is asynchronous in nature.
    * */
    OkHttpClient client = new OkHttpClient();
    String recID=null;
    Request request=null;
    MediaType JSON = MediaType.parse("application/json; charset=utf-8");
    totalRecs=cur!=null?cur.getCount():0;
    succesfulRecs=failedRecs=0;
    long generatedId=0;
    if (cur != null && cur.moveToFirst()) {
      do {
        try {
          Log.d("*************",cur.getString(cur.getColumnIndex("isRequired")));
          if (!cur.getString(cur.getColumnIndex("isRequired")).equals("true")) {
            Log.d("entered if", "yes true");
            //showMessage(cordova.getActivity().getResources().getString(R.string.mandatoryFields));
            isSyncInProgress=false;
            failedRecs += 1;
          }
          else{
            Log.d("else entered", "elseeeeeeeeee");
            JSONObject recordValue = new JSONObject();
            recordValue.put("taskId", cur.getString(cur.getColumnIndex("TaskId")));
            recordValue.put("formId", cur.getString(cur.getColumnIndex("FormId")));
            JSONObject rec = ((JSONObject) new JSONTokener(cur.getString(cur.getColumnIndex("FormValues"))).nextValue());
            Log.d("full object$$$", String.valueOf(rec));
            JSONArray recordArray=rec.getJSONArray("record");
            JSONObject recordObject= (JSONObject) recordArray.get(0);
   //         recordValue.put("resultFields", rec.getJSONArray("resultFields"));
            try{
              Log.d("long", (cur.getString(cur.getColumnIndex("long"))));
              recordValue.put("long", cur.getString(cur.getColumnIndex("long")));
            }
            catch (Exception e) {
              e.printStackTrace();
            }
            try{
              Log.d("lat", (cur.getString(cur.getColumnIndex("lat"))));
              recordValue.put("lat", cur.getString(cur.getColumnIndex("lat")));
            }
            catch (Exception e) {
              e.printStackTrace();
            }
            recordValue.put("record", rec.getJSONArray("record"));
            generatedId = (new Date()).getTime();
            recordValue.put("generatedId", generatedId);
            recordValue.put("updatedBy", params.get("USERNAME").toString());
            DateFormat dateFormat = new SimpleDateFormat("yyyy-MM-dd'T'HH:mm:ss.SSS'Z'", Locale.US);
            dateFormat.setTimeZone(TimeZone.getTimeZone("UTC"));
            recordValue.put("updatedTime", dateFormat.format(new Date()));
            RequestBody body=null;
            //   request = new Request.Builder().url(params.get("URI") + "/api/v1/tasks/addTaskRecord").post(body).build();
            Log.d("condition", (cur.getString(cur.getColumnIndex("recordType"))));
            if ((cur.getString(cur.getColumnIndex("recordType"))).equals("task")) {
              recordValue.put("UUID", params.get("UUID").toString());
              recordValue.put("recordId",cur.getString(cur.getColumnIndex("recordId")));
              Log.d("firsttttttt",(cur.getString(cur.getColumnIndex("recordType"))));
              body = RequestBody.create(JSON, recordValue.toString());
              request = new Request.Builder().url(params.get("URI") + "/api/v1/tasks/addTaskRecord").post(body).build();
            } else {
              //Log.d("rid log",recordObject.getString("RUID"));
              recordValue.put("version", cur.getString(cur.getColumnIndex("version")));
              //recordValue.put("RUID",recordObject.getString("RUID"));
              if(recordObject.has("RUID")){
                recordValue.put("RUID",recordObject.getString("RUID"));
                Log.d("rid log",recordObject.getString("RUID"));
              }
              recordValue.put("assignmentId", cur.getString(cur.getColumnIndex("AssignmentId")));
              Log.d("this is else condition", (cur.getString(cur.getColumnIndex("recordType"))));
              Log.d("sending object$$$$$", String.valueOf(recordValue));
              body = RequestBody.create(JSON, recordValue.toString());
              request = new Request.Builder().url(params.get("URI") + "/api/v1/projectProcesss/addProjectTaskRecord").post(body).build();
            }
            final String uniqueID = cur.getString(cur.getColumnIndex("uniqueID"));
            final long finalGeneratedId = generatedId;
            client.newCall(request).enqueue(new Callback() {
              @Override
              public void onFailure(Call call, IOException e) {
                Log.d("failureeeeeeeeeeeeeeeee", e.getMessage());

                failedRecs += 1;
                checkForCompletion(callbackContext);
              }

              @Override
              public void onResponse(Call call, Response response) throws IOException {
                Log.d("successssss ****", "yesss");
                if (response.code() == 200) {
                  succesfulRecs += 1;
                  resultsIDs.put(uniqueID);
                  geeneratedIds.put(uniqueID, finalGeneratedId);
                } else {
                  //Log.d("this is fail", response.body().string());
                  failedRecs += 1;

                }

                checkForCompletion(callbackContext);

              }
            });
          }
        } catch (Exception e) {
          e.printStackTrace();
        }

      } while (cur.moveToNext());
    }
    if(cur!=null){
      cur.close();
    }
    if(totalRecs==0){
      checkForCompletion(callbackContext);
    }

  }

  private HashMap<String,Object> parseInputData(JSONArray args,int type){
    /*Method which parses the input parameters.
    * */
    //Log.d("array values ****", args.toString());
    params=new HashMap<String, Object>();
    try {

      params.put("URI",((JSONObject) new JSONTokener(args.getJSONObject(0).toString()).nextValue()).getString("url"));
      params.put("UUID",((JSONObject) new JSONTokener(args.getJSONObject(1).toString()).nextValue()).getString("uuid"));
      params.put("USERNAME",((JSONObject) new JSONTokener(args.getJSONObject(2).toString()).nextValue()).getString("username"));

      if(type==1){
        params.put("TASK_IDS",((JSONObject) new JSONTokener(args.getJSONObject(3).toString()).nextValue()).getJSONArray("ids"));
      }
      else if(type==2){
        params.put("TASK_IDS",((JSONObject) new JSONTokener(args.getJSONObject(3).toString()).nextValue()).getJSONArray("taskids"));
        params.put("FORM_IDS",((JSONObject) new JSONTokener(args.getJSONObject(4).toString()).nextValue()).getJSONArray("formids"));
      }
      else{
        params.put("RECORD_IDS",((JSONObject) new JSONTokener(args.getJSONObject(3).toString()).nextValue()).getJSONArray("ids"));
      }

    } catch (JSONException e) {
      e.printStackTrace();


    }

    return params;

  }


  private void showMessage(final String msg){
     /*Method which shows the alert to the user regarding the progress of the sync process including the status
    * */
    cordova.getActivity().runOnUiThread(new Runnable() {
      @Override
      public void run() {

        Toast toast = Toast.makeText(cordova.getActivity(),msg, Toast.LENGTH_SHORT);
        toast.show();

      }
    });

  }

  private String  getIdsfromArray(JSONArray ids){
    /*Method which iterates over the input ids provided from the client side and creates a string.
    * */
    String keys=null;
    if (ids == null) {
      return "";
    }
    for(int i=0;i<ids.length();i++){
      try {
        String key=new StringBuilder().append('\'').append(ids.get(i).toString()).append('\'').toString();
        keys=(i==0?key.concat(","):keys.concat(key).concat(","));
      } catch (JSONException e) {
        e.printStackTrace();
      }
    }
    keys=keys.substring(0,keys.length()-1);
    return keys;
  }
  private Cursor fetchData(HashMap<String, Object> inParams, int type) {
    /*Method which parses the input parameters passed from the client,forms the query parameter and returns the cursor.
    * */
    String taskKeys=null,formKeys=null,recordkeys=null;
    String query=dbTableQuery;
    if(type==1){
      taskKeys=getIdsfromArray((JSONArray)inParams.get("TASK_IDS"));
      query=dbTableQuery.concat(" and  TaskId in ").concat(" ( ").concat(taskKeys).concat(" ) ");
    }
    else if(type==2){
      taskKeys=getIdsfromArray((JSONArray)inParams.get("TASK_IDS"));
      formKeys=getIdsfromArray((JSONArray)inParams.get("FORM_IDS"));
      query=dbTableQuery.concat(" and  TaskId in ").concat(" ( ").concat(taskKeys).concat(" ) ").concat(" and  FormId in ").concat(" ( ").concat(formKeys).concat(" ) ");
    }
    else{
      recordkeys=getIdsfromArray((JSONArray)inParams.get("RECORD_IDS"));
      query=dbTableQuery.concat(" and  uniqueID in ").concat(" ( ").concat(recordkeys).concat(" ) ");
    }
    Cursor cursor = db.rawQuery(query, null);
    return cursor;
  }

  @Override
  public boolean execute(final String action, final JSONArray args, final CallbackContext callbackContext) throws JSONException {
    /*Entry point of the cordova plugin .
    * */
    if(isSyncInProgress){
      showMessage(cordova.getActivity().getResources().getString(R.string.sync_in_progress));
      return true;
    }
    isSyncInProgress=true;
    cordova.getThreadPool().execute(new Runnable() {
      @Override
      public void run() {
        if(action.toLowerCase().equals("synctasks")){
          syncTaskData(args,callbackContext);
        }
        else if(action.toLowerCase().equals("syncforms")){
          syncFormData(args,callbackContext);
        }
        else if(action.toLowerCase().equals("syncrecords")) {
          syncRecordData(args,callbackContext);
        }
        else{
          syncVideoData(args,callbackContext);
        }
      }
    });
    return true;
  }


  @Override
  public void onDestroy() {
    /*Method which closes the database when the activity is being destroyed.
    * */
    super.onDestroy();
    if(db!=null){
      db.close();
    }
  }
}
