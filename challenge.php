<?php
if ($_POST["answered"]==true)
  if ($_POST["a1"]==2 && $_POST["a2"]==4 && $_POST["a3"]==1) {
    setcookie("fan_token", "-1", time()+604800, "/", $_SERVER['HTTP_HOST'], true, true);
    header("Location: index.php");
  } else {
    echo("回答错误！");
  }
?>

<!DOCTYPE html>
<html lang="zh">
<head>
    <meta charset="UTF-8">
    <title>Questionnaire</title>
</head>
<body>

<h1>请答题后继续</h1>

<form action="challenge.php" method="post">
    <input type="hidden" name="answered" value="true">

    <span class="quesiton">以下谁おぱい最贫？</span>
    <fieldset id="a1">
        <input type="radio" value="1" name="a1">ユリッカ
        <input type="radio" value="2" name="a1">サリエル
        <input type="radio" value="3" name="a1">エンマ
        <input type="radio" value="4" name="a1">キール
    </fieldset>

    <span class="quesiton">カノン的人偶原型是谁？</span>
    <fieldset id="a2">
        <input type="radio" value="1" name="a2">クリリア
        <input type="radio" value="2" name="a2">ミント
        <input type="radio" value="3" name="a2">ミュール
        <input type="radio" value="4" name="a2">ムース
    </fieldset>

    <span class="quesiton">“＊＊の叡智”是谁的技能？</span>
    <fieldset id="a3">
        <input type="radio" value="1" name="a3">クレア
        <input type="radio" value="2" name="a3">カノン
        <input type="radio" value="3" name="a3">フィーネム
        <input type="radio" value="4" name="a3">アストルフォ
    </fieldset>

    <input type="submit" value="Submit">
</form>
</body>
</html>
