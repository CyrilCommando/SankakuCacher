if (!lessthan5mssincelastkeypressed)
{
  try {
    clearTimeout(timeout2)
    clearTimeout(timeout)
  } catch (error) {
    
  }
  timeout2 = setTimeout(() => {
    lessthan5mssincelastkeypressed = true;
  }, 100);

  timeout = setTimeout(() => {
    if (lessthan5mssincelastkeypressed)
    {
      search_bar = true; sb_text = e.target.value; populateList(1, true);
      lessthan5mssincelastkeypressed = false;
    }
  }, 200);
}