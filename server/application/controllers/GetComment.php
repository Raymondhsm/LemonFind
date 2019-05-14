<?php
defined('BASEPATH') OR exit('No direct script access allowed');
use QCloud_WeApp_SDK\Mysql\Mysql as DB;

class GetComment extends CI_Controller {
  public function index() {
    $m_id=$_GET['id'];
    $pick=$_GET['pick'];

    $tableName=($pick=='true')?'pick_message':'lost_message';
    $goods='';
    $goods=DB::row($tableName,['*'],"id='$m_id'");
    $open_id=$goods->open_id;
    $user_info=DB::row('user_info',['user_info'],"open_id='$open_id'");
   
    $result=DB::select('comment left outer join user_info on comment.open_id=user_info.open_id',['c_id','m_id','time','comment.open_id','message','reply','user_info'],"m_id='$m_id'",'',' order by time desc');

    //回复
    $skey=$_GET['skey'];
    $open=DB::row('cSessionInfo',['*'],compact('skey'))->open_id;

    if($open_id==$open){
      $canReply=true;
    }else{
      $canReply=false;
    }

    $this->JSON([
            'goods'=>$goods,
            'user_info'=>$user_info->user_info,
            'data'=>$result,
            'canReply'=>$canReply
          ]);
  }
}