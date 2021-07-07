<?php

namespace app\Base;

/**
 * 用于简单获取 大屏app SMRPT post的数据
 */

class Base
{
    public function __construct()
    {}
}

class PostHandler extends Base
{
    const saveKey = "__SMRPT__";
    const saveVal = "Yotrio";

    private $savePath = '';

    private $saveFile = '';

    private $postData = [];

    private $formateData = '';

    private $content;

    public function __construct($path, $file)
    {
        parent::__construct();
        $this->savePath = $path;
        $this->saveFile = $file;
        $this->content = '';
    }

    public function savePostData()
    {
        if ($this->getPostData()) {
            return $this->beforeSave()->doSave()->afterSave();
        }
        return false;
    }

    private function getPostData()
    {
        $postData = [];

        if ($_POST) {
            $postData = $_POST;
        } else if (false != $tmpPost = file_get_contents('php://input')) {
            $postData = $tmpPost;
        }
        $this->postData = is_array($postData) ? $postData : json_decode($postData, true);

        if ($this->valid()) {
            unset($this->postData[PostHandler::saveKey]);
            return $this;
        }
        return false;
    }

    private function valid()
    {
        return $this->postData && array_key_exists(PostHandler::saveKey, $this->postData) && $this->postData[PostHandler::saveKey] == PostHandler::saveVal;
    }

    private function beforeSave()
    {
        $this->formateData = var_export($this->postData, true);
        $this->content = '日期：' . date('Y-m-d H:i:s') . PHP_EOL . 'post内容：' . $this->formateData . PHP_EOL;
        return $this;
    }

    private function doSave()
    {
        file_put_contents($this->savePath . $this->saveFile, $this->content, FILE_APPEND);
        return $this;
    }

    private function afterSave()
    {
        return true;
    }
}

(new PostHandler("E:/ionic/SMRPT/log/", date('Y-m-d') . "--postData.txt"))->savePostData();
