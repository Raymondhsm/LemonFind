<?php
defined('BASEPATH') OR exit('No direct script access allowed');
use QCloud_WeApp_SDK\Mysql\Mysql as DB;
use \QCloud_WeApp_SDK\Helper\Request as Request;
use \QCloud_WeApp_SDK\Conf as Conf;
use \QCloud_WeApp_SDK\Constants as Constants;

class Publish extends CI_Controller {
  public function index() {
    $skey=$_GET['skey'];
    $name = $_GET['goods'];
    $color= $_GET['color'];
    $brand= $_GET['brand'];
    $description= $_GET['description'];
    $images= $_GET['images'];
    $form_id=$_GET['form_id'];
    
    $time= date('Y-m-d H:i:s');
    $location= $_GET['position'];
    $loseOrPick = $_GET['condition'];
    //获取数据库中open_id
    $condition="skey='".$skey."'";
    $result=DB::select('cSessionInfo',['*'],$condition);
    $open_id=$result[0]->open_id;

    $tableName="$loseOrPick".'_message';
    $result= DB::insert($tableName,compact('open_id','name','color','brand','description','images','time','location'));

    // $this->json(['success'=>'yes'.$result]);

      //匹配饭卡
      if($name=='饭卡'||$name=='证件'){
        //去另外的数据库寻找
        $loseOrPick = $_GET['condition']=='lost'?'pick':'lost';
        $tableName="$loseOrPick".'_message';

        //构造where子句并选择
        $condition="brand='$brand'";
        $result=DB::row($tableName,['*'],$condition);

        //如果结果不为空，则返回goods_id
        if($result!=null){
          //将loseorpick回归正道
          $loseOrPick = $_GET['condition']=='lost'?'pick':'lost';
          //确定要发送模板消息的open_id
          if($loseOrPick=='pick'){
            $open_id=$result->open_id;
          }

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


            $url = "https://api.weixin.qq.com/cgi-bin/message/wxopen/template/send?access_token=$access_token";
            $timeout=Conf::getNetworkTimeout();
            $data = [
                "touser"=>"$open_id",  
                "template_id"=> "5Qw5YIkT6YLhHUs-eJ46uPyjeCFBceV-I749kqFcOk0",    
                "form_id"=> "$form_id", 
                "data"=> [
                    "keyword1"=> [
                        "value"=> "你的{$name}可能已被找到", 
                        "color"=> "#173177"
                    ], 
                    "keyword2"=> [
                        "value"=> "$location", 
                        "color"=> "#173177"
                    ], 
                    "keyword3"=> [
                        "value"=> "$description", 
                        "color"=> "#173177"
                    ] , 
                    "keyword4"=> [
                        "value"=> "快来把他领回去吧", 
                        "color"=> "#173177"
                    ] 
                  ],
            ];

            list($status, $body) = array_values(Request::jsonPost(compact('url','timeout','data')));

            if ($status !== 200 || !$body || $body['errcode']) {
                throw new Exception(Constants::E_PROXY_LOGIN_FAILED . ': ' . json_encode($body));
            }


          //返回找到的goods_id
          $this->JSON([
            'code'=>1,
            'goods_id'=>$result->id
          ]);
        }else{
          //返回找不到的code
          $this->JSON([
            'code'=>0,
            'goods_id'=>""
          ]);
        }
      }
  }
}