<?php
$qbank = json_decode(file_get_contents('qbank.json'),true);

if ($_POST["answered"]==true) {
  $score = 0;
  foreach($_POST as $key => $value) {
    if (strpos($key, 'qid_') === 0) {
      $qid=substr($key, 4);
      if ($value == $qbank[$qid]["choice"][0])
        $score += 1;
    }
  }
  if ($score >=3) {
    setcookie("fan_token", "-1", time()+604800, "/", $_SERVER['HTTP_HOST'], true, true);
    header("Location: index.php");
  } else {
    echo('<font color="red">回答错误！</font>');
  }
}

$paper = array_fill();
$i = 0;
foreach ($qbank as $qid=>$rec) {
  shuffle($rec["choice"]);
  $paper[$i] = array("qid"=>$qid, "q"=>$rec["question"], "c"=>$rec["choice"]);
  $i++;
}
shuffle($paper);
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

    <?php for ($i = 0; $i < 3; $i++): ?>
      <?php $p=$paper[$i]; ?>
    <span class="quesiton"><?php echo($p["q"]); ?></span>
    <fieldset id="qid_<?php echo($p["qid"]) ?>">
        <input type="radio" value="<?php echo($p["c"][0]) ?>" name="qid_<?php echo($p["qid"]) ?>"><?php echo($p["c"][0]) ?>
        <input type="radio" value="<?php echo($p["c"][1]) ?>" name="qid_<?php echo($p["qid"]) ?>"><?php echo($p["c"][1]) ?>
        <input type="radio" value="<?php echo($p["c"][2]) ?>" name="qid_<?php echo($p["qid"]) ?>"><?php echo($p["c"][2]) ?>
        <input type="radio" value="<?php echo($p["c"][3]) ?>" name="qid_<?php echo($p["qid"]) ?>"><?php echo($p["c"][3]) ?>
    </fieldset>
    <?php endfor; ?>

    <input type="submit" value="Submit">
</form>

</body>
</html>
