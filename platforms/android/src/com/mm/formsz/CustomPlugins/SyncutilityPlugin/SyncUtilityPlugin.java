package com.mm.formsz.CustomPlugins.SyncutilityPlugin;

import android.content.ContentValues;
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
import okhttp3.ResponseBody;
import okio.BufferedSource;


/**
 * Created by Manish on 20-02-2018.
 * Modified By Roja onn 15-10-2018
 */

public class SyncUtilityPlugin extends CordovaPlugin {

  private static final String dbTableQuery="SELECT * FROM FormData_table where FormStatus='saved'";
  //  private static final
  private static boolean isSyncInProgress;
  private static int totalRecs,succesfulRecs,failedRecs;
  private static  HashMap<String,Object> params;
  private static  JSONArray resultsIDs=new JSONArray();
  private static Hashtable geeneratedIds=new Hashtable();
  private SQLiteDatabase db = null;
  private JSONObject recordValue;
  private  String dbPath=null ;
  private OkHttpClient client;
  private CallbackContext callbackContext;

  @Override
  public void initialize(CordovaInterface cordova, CordovaWebView webView) {
    /*Method which initializes the plugin variables
    * */
    super.initialize(cordova, webView);
    dbPath = getDatabasePath();
    getHandleOnDatabase();
    resetCounters();
  }
  private void resetCounters(){
    /*Method which resets parameters used during the sync process
    * */
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
    private void checkForCompletion(){
    /*Method which keeps track of the sync process and show alert to user on completion;
    * */
    if(totalRecs==succesfulRecs+failedRecs) {
        showMessage(String.format(cordova.getActivity().getResources().getString(R.string.sync_completed), succesfulRecs, failedRecs));
      resetCounters();
    }
  }
  private  void insertToAnotherCollection(JSONObject recordValue, JSONArray recIds){
      /*Method which saves the record details in another collection "projectTaskSubmitedRecordsLog" */
    ContentValues values = new ContentValues();
    try {
      Date date= new Date();
      long time = date.getTime();
      values.put("User", recordValue.getString("updatedBy"));
      values.put("taskId", recordValue.getString("taskId"));
      values.put("formId", recordValue.getString("formId"));
      values.put("recordId", recordValue.getString("RUID"));
      values.put("insertDate", time);
      values.put("AssignmentId", recordValue.getString("assignmentId"));
    } catch (JSONException e) {
      e.printStackTrace();
    }
    long rowInserted= db.insert("projectTaskSubmitedRecordsLog", null, values);
    Log.d("step3***", String.valueOf(rowInserted));
    Log.d("deletedids**", String.valueOf(recIds));
    if(rowInserted != -1) {
      deleteRecords(recIds);
    }else{
      insertToAnotherCollection(recordValue, recIds);
    }


  }
  private void deleteRecords(JSONArray recIds){
    if(db!=null){
      Log.d("resultIds**","uniqueID= "+recIds.toString().replace("[","").replace("]",""));
      int id = db.delete("FormData_table", "uniqueID= "+recIds.toString().replace("[","").replace("]",""),null);
      Log.d("step4***", String.valueOf(id));

      if(id>0){
        succesfulRecs += 1;
           /*Method which keeps track of the sync process and show alert to user on completion;*/
        if(totalRecs==succesfulRecs+failedRecs) {
          showMessage(String.format(cordova.getActivity().getResources().getString(R.string.sync_completed), succesfulRecs, failedRecs));
          callbackContext.success("successfully synced");
          resetCounters();
        }
      }

    }

  }
  private void syncTaskData(JSONArray args){
    /*Method responsible to sync task data
    * */
    sendDataRequest(fetchData(parseInputData(args, 1),1));
  }
  private void syncFormData(JSONArray args){
    /*Method responsible to sync form data
    * */
    sendDataRequest(fetchData(parseInputData(args, 2),2));
  }
  private void syncRecordData(JSONArray args){
    /*Method responsible to sync record  data
    * */
    sendDataRequest(fetchData(parseInputData(args,3),3));
  }
  //  private void syncVideoData(JSONArray args, CallbackContext callbackContext){
//    //sendVideoRequest(fetchData(parseInputData(args,3),3), callbackContext);
//    sendMultipleVideoRequest(fetchData(parseInputData(args,3),3), callbackContext);
//  }
  private void syncProjectForms(JSONArray args){
    /*Method responsible to sync form data in project task
    * */
    sendDataRequest(fetchData(parseInputData(args, 4),4));
  }

  private void sendMultipleVideoRequest(Cursor cur, final String recordType, final JSONObject recordValue, final JSONArray resultsIDs){
//  private void sendMultipleVideoRequest(Cursor cur, int type, JSONObject recordValue, final CallbackContext callbackContext){
//    /*method responsible for sending the videos to mobile server.request calling is asynchronous in nature.
//    * */
    //OkHttpClient client = new OkHttpClient();
    MediaType  MEDIA_TYPE_PNG = MediaType.parse("video/mp4");
    Log.d("step2***",recordType);
    if(cur!=null&&cur.moveToFirst()){
      do {
        final String uniqueID=cur.getString(cur.getColumnIndex("uniqueID"));
        if (cur.getString(cur.getColumnIndex("isVideoAvailable"))==null){
          //      resultsIDs.put(uniqueID);
//          Log.d("in metrhodids***", String.valueOf(resultsIDs));
          if(recordType.equals("project")){
            insertToAnotherCollection( recordValue, resultsIDs);
          }else{
            deleteRecords(resultsIDs);
          }
//          deleteRecords(resultsIDs);
          continue;

        }
        JSONArray videosData;
        JSONArray videoOptions=null;
        try {
          videosData = new JSONArray(cur.getString(cur.getColumnIndex("videoOptions")));
          if (cur.getString(cur.getColumnIndex("isVideoAvailable")).equals("true") && videosData.length()==0){
       //     resultsIDs.put(uniqueID);
            if(recordType.equals("project")){
              insertToAnotherCollection( recordValue, resultsIDs);
            }else{
              deleteRecords(resultsIDs);
            }
            //        deleteRecords(resultsIDs);
            continue;

          }
    //      totalRecs+=1;

          //  try {
          videoOptions= ((JSONArray) new JSONTokener(cur.getString(cur.getColumnIndex("videoOptions"))).nextValue());
        } catch (JSONException e) {
          e.printStackTrace();
        }
        if(videoOptions != null) {
          for (int i=0; i<videoOptions.length();i++) {

            JSONObject rec = null;
            try {
              rec = videoOptions.getJSONObject(i);
            } catch (JSONException e) {
              e.printStackTrace();
            }
            if(rec != null) {

              JSONObject options = null;
              try {
                options = rec.getJSONObject("options");
              } catch (JSONException e) {
                e.printStackTrace();
              }
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
                Request request = new Request.Builder()
                        .url(params.get("URI") + "/api/v1/gridFS/addvideo/" + geeneratedIds.get(uniqueID))
                        .post(requestBody)
                        .build();
                client.newCall(request).enqueue(new Callback() {
                  @Override
                  public void onFailure(Call call, IOException e) {
                    failedRecs += 1;
//                    checkForCompletion(callbackContext);
                  }

                  @Override
                  public void onResponse(Call call, Response response) throws IOException {
                    if (response.code() == 200) {
//                      succesfulRecs += 1;
//                      resultsIDs.put(uniqueID);
                      if(recordType.equals("project")){
                        insertToAnotherCollection( recordValue, resultsIDs);
                      }else{
                        deleteRecords(resultsIDs);
                      }
                    } else {
                      failedRecs += 1;
                    }

//                    checkForCompletion(callbackContext);
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
    // if(totalRecs==0){
//      checkForCompletion(callbackContext);
    // }

  }

  private void sendDataRequest(final Cursor cur){
//    Log.d("method entered", "method");
    /* method responsible for sending the request to mobile server.request calling is asynchronous in nature.
    * */
    client = new OkHttpClient();
    //String recID=null;
    Request request;
    MediaType mediaType = MediaType.parse("application/json; charset=utf-8");
    totalRecs=cur!=null?cur.getCount():0;
    succesfulRecs=failedRecs=0;
    long generatedId;
    if (cur != null && cur.moveToFirst()) {
      do {
        try {
          if (!cur.getString(cur.getColumnIndex("isRequired")).equals("true")) {
            isSyncInProgress=false;
            failedRecs += 1;
            checkForCompletion();
          }
          else{
            final String recType;
            recordValue = new JSONObject();
            recordValue.put("taskId", cur.getString(cur.getColumnIndex("TaskId")));
            recordValue.put("formId", cur.getString(cur.getColumnIndex("FormId")));
            JSONObject rec = ((JSONObject) new JSONTokener(cur.getString(cur.getColumnIndex("FormValues"))).nextValue());
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
            generatedId = System.currentTimeMillis();
            recordValue.put("generatedId", generatedId);
            recordValue.put("updatedBy", params.get("USERNAME").toString());
            DateFormat dateFormat = new SimpleDateFormat("yyyy-MM-dd'T'HH:mm:ss.SSS'Z'", Locale.US);
            java.sql.Timestamp ts=new java.sql.Timestamp(Long.parseLong(cur.getString(cur.getColumnIndex("insertDate"))));
            Date date=new Date(ts.getTime());
            recordValue.put("updatedTime",dateFormat.format(date));
            RequestBody body;
            recType=cur.getString(cur.getColumnIndex("recordType"));
            if ((cur.getString(cur.getColumnIndex("recordType"))).equals("task")) {
              recordValue.put("UUID", params.get("UUID").toString());
              recordValue.put("recordId",cur.getString(cur.getColumnIndex("recordId")));
              body = RequestBody.create(mediaType, recordValue.toString());
              request = new Request.Builder().url(String.format("%s/api/v1/tasks/addTaskRecord", params.get("URI"))).post(body).build();
            } else {
              recordValue.put("version", cur.getString(cur.getColumnIndex("version")));
              if(recordObject.has("RUID")){
                recordValue.put("RUID",recordObject.getString("RUID"));
              }
              recordValue.put("assignmentId", cur.getString(cur.getColumnIndex("AssignmentId")));
              recordValue.put("sqliteDBId", cur.getString(cur.getColumnIndex("uniqueID")));
              body = RequestBody.create(mediaType, recordValue.toString());
              request = new Request.Builder().url(String.format("%s/api/v1/projectProcesss/addProjectTaskRecord", params.get("URI"))).post(body).build();
            }
            final String uniqueID = cur.getString(cur.getColumnIndex("uniqueID"));
            final long finalGeneratedId = generatedId;
            client.newCall(request).enqueue(new Callback() {
              @Override
              public void onFailure(Call call, IOException e) {
                Log.d("failure", e.getMessage());
                failedRecs += 1;
//                checkForCompletion(callbackContext);
              }

              @Override
              public void onResponse(Call call, final Response response) throws IOException {
                // Log.d("serverresponse***", response.body().sela VASTHNDO HUDATANIKI Mtring());


                new Thread(new Runnable() {
                  @Override
                  public void run() {

                    try {
                      String responseData = response.body().string();
                      if (response.code() == 200) {
                        JSONObject myObject = new JSONObject(responseData);
                        if (myObject.has("sqliteDBId")) {
                          String id = myObject.getString("sqliteDBId");
                          Log.d("step1***", id);

//                          Log.d("8888***", String.valueOf(myObject.getString("sqliteDBId")));
                          resultsIDs = new JSONArray();
//                          resultsIDs.put(uniqueID);
                          resultsIDs.put(myObject.getString("sqliteDBId"));
                          Log.d("finalIds**", String.valueOf(resultsIDs));
                          geeneratedIds.put(uniqueID, finalGeneratedId);
                          HashMap<String, Object> recDetails = new HashMap<String, Object>();
                          try {

                            recDetails.put("URL", params.get("URI"));
                            recDetails.put("UUID", params.get("UUID"));
                            recDetails.put("USERNAME", params.get("USERNAME"));
                            recDetails.put("RECORD_IDS", resultsIDs);
                          } catch (Exception e) {
                            e.printStackTrace();
                          }
                          sendMultipleVideoRequest(fetchData(recDetails, 3), recType, recordValue,resultsIDs);

                        } else {
                          failedRecs += 1;
                        }
                      }
                    } catch (Exception e) {
                      e.printStackTrace();
                    }
                  }
                }).start();

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
 /*   if(totalRecs==0){
//      checkForCompletion(callbackContext);
    }*/

  }

  private HashMap<String,Object> parseInputData(JSONArray args,int type){
    /*Method which parses the input parameters.
    * */

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
      else if(type==4){
        params.put("TASK_IDS",((JSONObject) new JSONTokener(args.getJSONObject(3).toString()).nextValue()).getJSONArray("taskids"));
        params.put("ASSIGNMENT_IDS",((JSONObject) new JSONTokener(args.getJSONObject(4).toString()).nextValue()).getJSONArray("assignmentids"));
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
    // String keys=null;
    if (ids == null) {
      return "";
    }
    return  ids.toString().replace("[","(").replace("]",")");
//    for(int i=0;i<ids.length();i++){
//      try {
//        String key=new StringBuilder().append('\'').append(ids.get(i).toString()).append('\'').toString();
//        keys=(i==0?key.concat(","):keys.concat(key).concat(","));
//      } catch (JSONException e) {
//        e.printStackTrace();
//      }
//    }
    // keys=keys.substring(0,keys.length()-1);
    //return keys;

  }
  private Cursor fetchData(HashMap<String, Object> inParams, int type) {
    /*Method which parses the input parameters passed from the client,forms the query parameter and returns the cursor.
    * */
    String taskKeys,formKeys,recordkeys,assignmentKeys;
    String query;
    if(type==1){
      taskKeys=getIdsfromArray((JSONArray)inParams.get("TASK_IDS"));
      query=dbTableQuery.concat(" and  TaskId in ").concat(taskKeys);
      //query=dbTableQuery.concat(" and  TaskId in ").concat(" ( ").concat(taskKeys).concat(" ) ");
    }
    else if(type==2){
      taskKeys=getIdsfromArray((JSONArray)inParams.get("TASK_IDS"));
      formKeys=getIdsfromArray((JSONArray)inParams.get("FORM_IDS"));
      query=dbTableQuery.concat(" and  TaskId in ").concat(taskKeys).concat(" and  FormId in ").concat(formKeys);
      //  query=dbTableQuery.concat(" and  TaskId in ").concat(" ( ").concat(taskKeys).concat(" ) ").concat(" and  FormId in ").concat(" ( ").concat(formKeys).concat(" ) ");
    }
    else if(type==4){
      taskKeys=getIdsfromArray((JSONArray)inParams.get("TASK_IDS"));
      assignmentKeys=getIdsfromArray((JSONArray)inParams.get("ASSIGNMENT_IDS"));
      query=dbTableQuery.concat(" and  TaskId in ").concat(taskKeys).concat(" and  AssignmentId in ").concat(assignmentKeys);
      //  query=dbTableQuery.concat(" and  TaskId in ").concat(" ( ").concat(taskKeys).concat(" ) ").concat(" and  AssignmentId in ").concat(" ( ").concat(assignmentKeys).concat(" ) ");
    }
    else{
      recordkeys=getIdsfromArray((JSONArray)inParams.get("RECORD_IDS"));
      query=dbTableQuery.concat(" and  uniqueID in ").concat(recordkeys);
      //  query=dbTableQuery.concat(" and  uniqueID in ").concat(" ( ").concat(recordkeys).concat(" ) ");
    }
    return db.rawQuery(query, null);
  }

  @Override
  public boolean execute(final String action, final JSONArray args, final CallbackContext callbackContext) throws JSONException {
    /*Entry point of the cordova plugin .
    * */
    this.callbackContext = callbackContext;
    if(isSyncInProgress){
      showMessage(cordova.getActivity().getResources().getString(R.string.sync_in_progress));
      return true;
    }
    isSyncInProgress=true;
    cordova.getThreadPool().execute(new Runnable() {
      @Override
      public void run() {
        if(action.toLowerCase().equals("synctasks")){
          syncTaskData(args);
        }
        else if(action.toLowerCase().equals("syncforms")){
          syncFormData(args);
        }
        else if(action.toLowerCase().equals("syncprojectforms")){
          syncProjectForms(args);
        }
        else if(action.toLowerCase().equals("syncrecords")) {
          syncRecordData(args);
        }
/*        else{
//          syncVideoData(args,callbackContext);
        }*/
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
