<?php
defined('BASEPATH') OR exit('No direct script access allowed');
use QCloud_WeApp_SDK\Mysql\Mysql as DB;

class History extends CI_Controller {
  public function index() {
    $skey=$_GET['skey'];
    $loseOrPick=$_GET['loseOrPick'];
    $tableName= $loseOrPick.'_message';

    $suffix='order by time desc';
    //只需要头像和昵称
    $result= DB::row('cSessionInfo',['*'],['skey'=>$skey]);
    // $user_info=json_decode($result->user_info,true);
    // $avatarUrl=$user_info['avatarUrl'];
    // $nickName=$user_info['nickName'];
    // $user_info=compact('avatarUrl','nickName');


    $open_id=$result->open_id;
    $user_info=DB::row('user_info',['user_info'],['open_id'=>$open_id]);
    $result= DB::select($tableName,['*'],['open_id'=>$open_id],'',$suffix);
    // if(gettype($result) != 'array')
    //   $result=array($result);
    //就算是只有一个结果，返回的也是一个数组
    $this->json([
      'message'=>$result,
      'user_info'=>$user_info->user_info
      ]);
  }
}