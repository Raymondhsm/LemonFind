<?php
defined('BASEPATH') OR exit('No direct script access allowed');
use QCloud_WeApp_SDK\Mysql\Mysql as DB;

class information extends CI_Controller {
    public function index() {

      
      $skey=$_GET['skey'];
      $action=$_GET['action'];

      //获取数据库中open_id
      // $condition="skey='".$skey."'";
      // $result=DB::select('cSessionInfo',['*'],$condition);
      // $open_id=$result[0]->open_id;
      
      //获取用户头像和昵称单独存储
      $result= DB::row('cSessionInfo',['*'],['skey'=>$skey]);
      $user_info=json_decode($result->user_info,true);
      $avatarUrl=$user_info['avatarUrl'];
      $nickName=$user_info['nickName'];
      $user_info=compact('avatarUrl','nickName');
      $user_info=json_encode($user_info);//数组转换成json字符串
      $open_id=$result->open_id;

      //构造where子句中的open_id条件
      $condi="open_id='".$open_id."'";
      //获取用户信息数据
      $record=DB::select('user_info',['*'],$condi);

      //将用户数据上传到数据库
      if($action==0){
        $school=$_GET['school'];
        $college=$_GET['college'];
        $name=$_GET['name'];
        $s_id=$_GET['studentID'];
        $phone=$_GET['phoneNumber'];

        //判断数据库有无该记录，有则更新，无则插入
        if($record==null){
          DB::insert('user_info',compact('open_id','s_id','name','school','college','phone','user_info'));
          return;
        }else{
          DB::update('user_info',compact('open_id','s_id','name','school','college','phone','user_info'),compact('open_id'));
          return;
        }
      }

     if($record==null){
       $this->json([
        'school'=>"",
        'college'=>"",
        'name'=>"",
        'studentID'=>"",
        'phoneNumber'=>""
       ]);
     }else{
       $record=$record[0];
        $this->json([
        'school'=>$record->school,
        'college'=>$record->college,
        'name'=>$record->name,
        'studentID'=>$record->s_id,
        'phoneNumber'=>$record->phone
       ]);
     }

    }
}