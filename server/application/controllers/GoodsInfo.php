<?php
defined('BASEPATH') OR exit('No direct script access allowed');
use QCloud_WeApp_SDK\Mysql\Mysql as DB;

class GoodsInfo extends CI_Controller {
  public function index() {

    // $time= date('Y-m-d H:i:s');
    // $location= $_GET['location'];
    // $skey=$_GET['skey'];
    // $condition="skey='".$skey."'";
    // $user=DB::row('cSessionInfo',['*'],$condition);
    // $open_id=$user->open_id;


    // $open_id="o_QcD0VEnN7DCfIJY63nj4tvozaE";
    $loseOrPick=$_GET['loseOrPick'];
    $tableName="$loseOrPick".'_message join user_info using(open_id)';
    // $user_info= DB::row('cSessionInfo',['user_info'],['open_id'=>$open_id]);
    $columns=array('id',$loseOrPick.'_message.name','color','brand','description','images','time','location','user_info');
    $suffix='order by time desc';

    //正则匹配
    if($_GET['hasKey']=='true'){
      // $color_selected=$_GET['color_selected'];
      $condition='';
      if(!empty($_GET['goods_selected'])){
        $goods_selected=$_GET['goods_selected'];
        $condition.=" $loseOrPick".'_message.name REGEXP '."'$goods_selected'";
      }
      
      //因为颜色就算没有选传进来也是一个数组[]；
      $color=json_decode($_GET['color_selected']);
      if(!empty($color)){
        $color_selected='';
        for($i=0;$i<count($color);$i++){
          $color_selected.=$color[$i].'(.*)';
          //此处根据客户端颜色的序列前后顺序是一定的而做出如此多颜色匹配正则表达式
        }
        $condition.=empty($condition)?' color REGEXP '."'$color_selected'":' and color REGEXP '."'$color_selected'";
      }

      //, 'color REGEXP'."$color_selected"];
      $result= DB::select($tableName,$columns,$condition,'',$suffix);
      //就算只有1行结果，$result也会是一个数组，[{},{}]的形式

      $this->json(['message'=>$result]);
    }

    else{
    //多用户处理尚未进行
    $result= DB::select($tableName,$columns,'','',$suffix);
    $this->json(['message'=>$result]);
    }
    // $result= DB::row('cSessionInfo',['open_id','user_info'],['open_id'=>$open_id]);
    // $user_info= json_decode($result->user_info);//对user_info进行解码变成json对象

    // $result= DB::insert('lost_message',compact('open_id','name','color','brand','description','images','time','location'));

  }
}
