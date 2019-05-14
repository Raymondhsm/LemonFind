<?php
defined('BASEPATH') OR exit('No direct script access allowed');
use QCloud_WeApp_SDK\Mysql\Mysql as DB;
use \QCloud_WeApp_SDK\Helper\Request as Request;
use \QCloud_WeApp_SDK\Conf as Conf;
use \QCloud_WeApp_SDK\Constants as Constants;

class Comment extends CI_Controller {
  public function index() {
    $action=$_GET['action'];
    $m_id=$_GET['id'];

    $skey=$_GET['skey'];
    $open_id=DB::row('cSessionInfo',['*'],"skey='$skey'")->open_id;

    if($action=='comment'){
      $message=$_GET['message'];
      $reply="";
      DB::insert('comment',compact('m_id','open_id','message','reply'));
      $tableName=$_GET['pick']=='true'?'pick_message':'lost_message';
      $open_id=DB::row($tableName,['open_id'],"id='$m_id'")->open_id;
      $nickName=json_decode(DB::row('user_info',['user_info'],"open_id='$open_id'")->user_info,true);
      $nickName=$nickName['nickName'];

      // $nickName=(DB::row('user_info',['user_info'],"open_id='$open_id'")->user_info)->nickName;
    }else{
      $reply=$_GET['reply'];
      $c_id=$_GET['c_id'];
      DB::update('comment',compact('reply'),compact('c_id'));
      $open_id=DB::row('comment',['open_id'],"c_id='$c_id'")->open_id;
      $nickName=json_decode(DB::row('user_info',['user_info'],"open_id='$open_id'")->user_info,true);
      $nickName=$nickName['nickName'];
      $message=$reply;
    }

    $form_id=$_GET['form_id'];
//发送模板消息
    $APPID='wxe1ffa87be89a08c9';                          //这两行注意改
    $APPSECRET='4d47a95cc69e3adc1edfb56be71d77c2';

    list($status, $body) = array_values(Request::get([
          'url' => "https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid=$APPID&secret=$APPSECRET",
          'timeout' => Conf::getNetworkTimeout()
      ]));

      if ($status !== 200 || !$body || isset($body['errcode'])) {
          throw new Exception(Constants::E_PROXY_LOGIN_FAILED . ': ' . json_encode($body));
      }

      $access_token=$body['access_token'];

echo $form_id;
      $url = "https://api.weixin.qq.com/cgi-bin/message/wxopen/template/send?access_token=$access_token";
      $timeout=Conf::getNetworkTimeout();
      $data = [
          "touser"=>"$open_id",  
          "template_id"=>"GqBgh2S5mmkmqfDcSpF8qBEu68nFLEb2OTwCOazAWro",    
          "form_id"=>"$form_id", 
          "data"=> [
              "keyword1"=> [
                  "value"=> "$message", 
                  "color"=> "#173177"
              ], 
              "keyword2"=> [
                  "value"=> "bbq",//"date('Y-m-d H:i:s')", 
                  "color"=> "#173177"
              ], 
              "keyword3"=> [
                  "value"=> "$nickName", 
                  "color"=> "#173177"
              ] , 
              "keyword4"=> [
                  "value"=> "快来看看吧", 
                  "color"=> "#173177"
              ] 
            ],
      ];

      list($status, $body) = array_values(Request::jsonPost(compact('url','timeout','data')));
echo $data['form_id'];
echo json_encode($body);
      if ($status !== 200 || !$body || $body['errcode']) {
          throw new Exception(Constants::E_PROXY_LOGIN_FAILED . ': ' . json_encode($body));
      }

  }
}