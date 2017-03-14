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
    echo('<script>alert("違います！\r\nもう一度やり直してください。");</script>');
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
<html lang="ja">
<head>
    <meta charset="UTF-8">
    <title>Questionnaire</title>
</head>
<body>

<h1>続行するには、以下の質問に答えてください。</h1>

<form action="challenge.php" method="post">
    <input type="hidden" name="answered" value="true">

    <?php for ($i = 0; $i < 3; $i++): ?>
      <?php $p=$paper[$i]; ?>
    <span class="quesiton"><?php echo($p["q"]); ?></span>
    <fieldset id="qid_<?php echo($p["qid"]) ?>">
      <?php foreach ($p["c"] as $c): ?>
        <input type="radio" value="<?php echo($c) ?>" name="qid_<?php echo($p["qid"]) ?>"><?php echo($c) ?>
      <?php endforeach; ?>
    </fieldset>
    <?php endfor; ?>

    <input type="submit" value="Submit">
</form>

</body>
</html>
