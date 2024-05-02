"use strict";

//  --- Not in the interface ---

function internal_get_a_class_named (curr, searched_name) {
  if (!curr) {
    gui_log_to_history("internal_get_a_class_named, no curr for " +
                       searched_name);
  }
  var notes = null;
  for (var i = 0; i < curr.childNodes.length; i++) {
    if (curr.childNodes[i].className === searched_name) {
      notes = curr.childNodes[i];
      break;
    }
  }
  return notes;
}

function internal_FixTheRanking (rank) {
  var ret_rank = 'NoRank';
  if (rank === 14) {
    ret_rank = 'ace';
  } else if (rank === 13) {
    ret_rank = 'king';
  } else if (rank === 12) {
    ret_rank = 'queen';
  } else if (rank === 11) {
    ret_rank = 'jack';
  } else if (rank > 0 && rank < 11) {
    // Normal card 1 - 10
    ret_rank = rank;
  } else {
    console.log(typeof rank);
    alert('Unknown rank ' + rank);
  }
  return ret_rank;
}

function internal_FixTheSuiting (suit) {
  if (suit === 'c') {
    suit = 'clubs';
  } else if (suit === 'd') {
    suit = 'diamonds';
  } else if (suit === 'h') {
    suit = 'hearts';
  } else if (suit === 's') {
    suit = 'spades';
  } else {
    alert('Unknown suit ' + suit);
    suit = 'yourself';
  }
  return suit;
}

function internal_GetCardImageUrl (card) {
  var suit = card.substring(0, 1);
  var rank = parseInt(card.substring(1));
  rank = internal_FixTheRanking(rank); // 14 -> 'ace' etc
  suit = internal_FixTheSuiting(suit); // c  -> 'clubs' etc

  return "url('static/images/" + rank + "_of_" + suit + ".png')";
}

function internal_setBackground (diva, image, opacity) {
  var komage = diva.style;
  komage.opacity = opacity;
  komage['background-image'] = image;
}

function internal_setCard (diva, card, folded) {
  // card may be "" -> do not show card
  //             "blinded" -> show back
  //             "s14" -> show ace of spades
  var image;
  var opacity = 1.0;
  if (typeof card === 'undefined') {
    alert('Undefined card ' + card);
    image = "url('static/images/outline.gif')";
  } else if (card === "") {
    image = "url('static/images/outline.gif')";
  } else if (card === "blinded") {
    image = "url('static/images/cardback.png')";
  } else {
    if (folded) {
      opacity = 1;
      document.getElementById("mybet").style.background = "black";
    }
    image = internal_GetCardImageUrl(card);
  }
  internal_setBackground(diva, image, opacity);
}

function internal_clickin_helper (button, button_text, func_on_click) {
  if (button_text === 0) {
    button.style.visibility = 'hidden';
  } else {
    button.style.visibility = 'visible';
    button.innerHTML = button_text;
    button.onclick = func_on_click;
  }
}

//  --- here is the GUI stuff ---

function gui_hide_poker_table () {
  var table = document.getElementById('poker_table');
  table.style.visibility = 'hidden';
}

function gui_show_poker_table () {
  var table = document.getElementById('poker_table');
  table.style.visibility = 'visible';
}

function gui_set_player_name (name, seat) {
  var table = document.getElementById('poker_table');
  var current = 'seat' + seat;
  var seatloc = table.children[current];
  var chipsdiv = internal_get_a_class_named(seatloc, 'name-chips');
  var namediv = internal_get_a_class_named(chipsdiv, 'player-name');
  if (name === "") {
    seatloc.style.visibility = 'hidden';
  } else {
    seatloc.style.visibility = 'visible';
  }
  namediv.textContent = name;
}

function gui_hilite_player (hilite_color, name_color, seat, firedup) {
  var table = document.getElementById('poker_table');
  var current = 'seat' + seat;
  var seatloc = table.children[current];
  var chipsdiv = internal_get_a_class_named(seatloc, 'name-chips');
  //  var chipsdiv = seatloc.getElementById('name-chips');
  var namediv = internal_get_a_class_named(chipsdiv, 'player-name');
  var winnerseat = 'avatar' + seat;

  if (name_color === "") {
    namediv.style.color = chipsdiv.style.color;
  } else {
    namediv.style.color = name_color;
  }
  if (hilite_color === "") {
    namediv.style.backgroundColor = chipsdiv.style.backgroundColor;
    chipsdiv.style.background = firedup;

  } else {
    namediv.style.backgroundColor = hilite_color;
    chipsdiv.style.background = firedup;
  }
  if (seat == 1 && hilite_color == 'red')
  {
               var avatarname = "avatar" + botarray[0];
               var avatarimage = "avatar/_bot" + botarray[0] + "_winner.png"
               document.getElementById(avatarname).src = avatarimage;   
               $("#botspeech1").text("I win...");
               $("#botspeech1").show().delay(5000).fadeOut();
  }
  if (seat == 2 && hilite_color == 'red')
  {
               var avatarname = "avatar" + botarray[1];
               var avatarimage = "avatar/_bot" + botarray[1] + "_winner.png"
               document.getElementById(avatarname).src = avatarimage;
               $("#botspeech2").text("I win...");
               $("#botspeech2").show().delay(5000).fadeOut();
  }
  if (seat == 3 && hilite_color == 'red')
  {
               var avatarname = "avatar" + botarray[2];
               var avatarimage = "avatar/_bot" + botarray[2] + "_winner.png"
               document.getElementById(avatarname).src = avatarimage;
               $("#botspeech3").text("I win...");
               $("#botspeech3").show().delay(5000).fadeOut();
  }
  if (seat == 4 && hilite_color == 'red')
  {
               var avatarname = "avatar" + botarray[3];
               var avatarimage = "avatar/_bot" + botarray[3] + "_winner.png"
               document.getElementById(avatarname).src = avatarimage;
               $("#botspeech4").text("I win...");
               $("#botspeech4").show().delay(5000).fadeOut();
  }
  if (seat == 5 && hilite_color == 'red')
  {
               var avatarname = "avatar" + botarray[4];
               var avatarimage = "avatar/_bot" + botarray[4] + "_winner.png"
               document.getElementById(avatarname).src = avatarimage;
               $("#botspeech5").text("I win...");
               $("#botspeech5").show().delay(5000).fadeOut();
  }
  if (seat == 6 && hilite_color == 'red')
  {
               var avatarname = "avatar" + botarray[5];
               var avatarimage = "avatar/_bot" + botarray[5] + "_winner.png"
               document.getElementById(avatarname).src = avatarimage;
               $("#botspeech6").text("I win...");
               $("#botspeech6").show().delay(5000).fadeOut();
  }
  if (seat == 7 && hilite_color == 'red')
  {
               var avatarname = "avatar" + botarray[6];
               var avatarimage = "avatar/_bot" + botarray[6] + "_winner.png"
               document.getElementById(avatarname).src = avatarimage;
               $("#botspeech7").text("I win...");
               $("#botspeech7").show().delay(5000).fadeOut();
  }
  if (seat == 8 && hilite_color == 'red')
  {
               var avatarname = "avatar" + botarray[7];
               var avatarimage = "avatar/_bot" + botarray[7] + "_winner.png"
               document.getElementById(avatarname).src = avatarimage;
               $("#botspeech8").text("I win...");
               $("#botspeech8").show().delay(5000).fadeOut();
  }
}

function gui_set_bankroll (amount, seat) {
  var table = document.getElementById('poker_table');
  var current = 'seat' + seat;
  var seatloc = table.children[current];
  var chipsdiv = internal_get_a_class_named(seatloc, 'name-chips');
  //  var chipsdiv = seatloc.getElementById('name-chips');
  var namediv = internal_get_a_class_named(chipsdiv, 'chips');
  if (!isNaN(amount) && amount != "") {
    amount = "$" + amount;
  }
  namediv.textContent = amount;
}

function gui_set_bet (bet, seat) {
  var table = document.getElementById('poker_table');
  var current = 'seat' + seat;
  var seatloc = table.children[current];
  var betdiv = internal_get_a_class_named(seatloc, 'bet');

  betdiv.textContent = bet;
}

function gui_set_player_cards (card_a, card_b, seat, folded) {
  var table = document.getElementById('poker_table');
  var current = 'seat' + seat;
  var seatloc = table.children[current];
  var cardsdiv = internal_get_a_class_named(seatloc, 'holecards');
  var card1 = internal_get_a_class_named(cardsdiv, 'card holecard1');
  var card2 = internal_get_a_class_named(cardsdiv, 'card holecard2');

  internal_setCard(card1, card_a, folded);
  internal_setCard(card2, card_b, folded);
}

function gui_lay_board_card (n, the_card) {
  // Write the card no 'n'
  // the_card = "c9";

  var current = '';

  if (n === 0) {
    current = 'flop1';
  } else if (n === 1) {
    current = 'flop2';
  } else if (n === 2) {
    current = 'flop3';
  } else if (n === 3) {
    current = 'turn';
  } else if (n === 4) {
    current = 'river';
  }

  var table = document.getElementById('poker_table');
  var seatloc = table.children.board;

  var cardsdiv = seatloc.children[current];
  internal_setCard(cardsdiv, the_card);
}

function gui_burn_board_card (n, the_card) {
  // Write the card no 'n'
  // the_card = "c9";

  var current = '';

  if (n === 0) {
    current = 'burn1';
  } else if (n === 1) {
    current = 'burn2';
  } else if (n === 2) {
    current = 'burn3';
  }

  var table = document.getElementById('poker_table');
  var seatloc = table.children.board;

  var cardsdiv = seatloc.children[current];
  internal_setCard(cardsdiv, 'blinded');
}

function gui_write_basic_general (pot_size) {
  var table = document.getElementById('poker_table');
  var pot_div = table.children.pot;
  var total_div = pot_div.children['total-pot'];

  var the_pot = 'Total pot: ' + pot_size;
  total_div.innerHTML = the_pot;
}

function gui_write_basic_general_text (text) {
  var table = document.getElementById('poker_table');
  var pot_div = table.children.pot;
  var total_div = pot_div.children['total-pot'];
  total_div.style.visibility = 'visible';
  total_div.innerHTML = text;
}

var log_text = [];
var log_index = 0;

function gui_log_to_history (text_to_write) {
  for (var idx = log_index; idx > 0; --idx) {
    log_text[idx] = log_text[idx - 1];
  }

  log_text[0] = text_to_write;
  if (log_index < 500) {               //40
    log_index = log_index + 1;
  }
  var text_to_output = '<br>' + log_text[0] + '';
  for (idx = 1; idx < log_index; ++idx) {
    text_to_output += '<br>' + log_text[idx];
  }
  var history = document.getElementById('history');
  history.innerHTML = text_to_output;
}

function gui_hide_log_window () {
  var history = document.getElementById('history');
  //  history.style.visibility = 'hidden';
  history.style.display = "block";
}

function gui_place_dealer_button (seat) {
  var table_seat = seat; // interface start at 1
  var button0 = document.getElementById('button0');
  var button1 = document.getElementById('button1');
  var button2 = document.getElementById('button2');
  var button3 = document.getElementById('button3');
  var button4 = document.getElementById('button4');
  var button5 = document.getElementById('button5');
  var button6 = document.getElementById('button6');
  var button7 = document.getElementById('button7');
  var button8 = document.getElementById('button8');
  var button9 = document.getElementById('button9');
  /* if (seat < 0) {
    button0.style.visibility = 'hidden';
  } else {
    button0.style.visibility = 'visible';
  } */
  if (table_seat == 0) {
    button0.style.display = 'block';
  } else {
    button0.style.display = 'none';
  }
  if (table_seat == 1) {
    button1.style.display = 'block';
  } else {
    button1.style.display = 'none';
  }
  if (table_seat == 2) {
    button2.style.display = 'block';
  } else {
    button2.style.display = 'none';
  }
  if (table_seat == 3) {
    button3.style.display = 'block';
  } else {
    button3.style.display = 'none';
  }
  if (table_seat == 4) {
    button4.style.display = 'block';
  } else {
    button4.style.display = 'none';
  }
  if (table_seat == 5) {
    button5.style.display = 'block';
  } else {
    button5.style.display = 'none';
  }
  if (table_seat == 6) {
    button6.style.display = 'block';
  } else {
    button6.style.display = 'none';
  }
  if (table_seat == 7) {
    button7.style.display = 'block';
  } else {
    button7.style.display = 'none';
  }
  if (table_seat == 8) {
    button8.style.display = 'block';
  } else {
    button8.style.display = 'none';
  }
  if (table_seat == 9) {
    button9.style.display = 'block';
  } else {
    button9.style.display = 'none';
  }
  //button0.className = 'seat' + table_seat + '-button';
}

function gui_hide_dealer_button () {
  gui_place_dealer_button(-3);
}

function gui_hide_fold_call_click () {
  var buttons = document.getElementById('action-options');
  var fold = buttons.children['fold-button'];
  internal_clickin_helper(fold, 0, 0);

  var call = buttons.children['call-button'];
  internal_clickin_helper(call, 0, 0);
  gui_disable_shortcut_keys();
}

function gui_setup_fold_call_click (show_fold, call_text,
  fold_func, call_func, key_ev) {
  // Here we have a coupling of the functions 'human_fold' and 'human_call'
  var buttons = document.getElementById('action-options');
  var fold = buttons.children['fold-button'];
  internal_clickin_helper(fold, show_fold, fold_func);

  var call = buttons.children['call-button'];
  internal_clickin_helper(call, call_text, call_func);
}

function curry_in_speedfunction (speed_func) {
  var call_back = speed_func;

  var ret_func = function () {
    var buttons = document.getElementById('setup-options');
    var speed = buttons.children['speed-button'];
    var selector = speed.children['speed-selector'];
    var qqq = selector.children['speed-options'];
    var index = qqq.value;
    var value = qqq[index].text;

    call_back(value);
  };
  return ret_func;
}

function gui_set_selected_speed_option (index) {
  var buttons = document.getElementById('setup-options');
  var speed = buttons.children['speed-button'];
  var selector = speed.children['speed-selector'];
  var qqq = selector.children['speed-options'];
  qqq.value = index;
}

function internal_le_button (buttons, button_name, button_func) {
  var le_button = buttons.children[button_name];
  le_button.style.visibility = 'visible';
  le_button.onclick = button_func;
}

function gui_setup_option_buttons (name_func,
                                   speed_func,
                                   help_func,
                                   check_func,
                                   mode_func) {
  var buttons = document.getElementById('setup-options');

  internal_le_button(buttons, 'name-button', name_func);

  var speed = buttons.children['speed-button'];
  speed.style.visibility = 'visible';
  speed.onchange = curry_in_speedfunction(speed_func);

  internal_le_button(buttons, 'mode-button', mode_func);
  internal_le_button(buttons, 'help-button', help_func);
  internal_le_button(buttons, 'check-button', check_func);
}

function internal_hide_le_button (buttons, button_name, button_func) {
  var le_button = buttons.children[button_name];
  le_button.style.visibility = 'hidden';
}

function gui_hide_setup_option_buttons (name_func,
                                        speed_func,
                                        help_func,
                                        check_func) {
  var buttons = document.getElementById('setup-options');

  internal_hide_le_button(buttons, 'name-button');
  internal_hide_le_button(buttons, 'speed-button');
  internal_hide_le_button(buttons, 'mode-button');
  internal_hide_le_button(buttons, 'help-button');
  internal_hide_le_button(buttons, 'check-button');
}

function gui_hide_game_response () {
  var response = document.getElementById('game-response');
  response.style.visibility = 'hidden';
}

function gui_show_game_response () {
  var response = document.getElementById('game-response');
  response.style.visibility = 'visible';
}

function gui_write_game_response (text) {
  var response = document.getElementById('game-response');
  response.innerHTML = text;
 var response2 = document.getElementById('game-response2');
  response2.innerHTML = text; 
}

function gui_set_game_response_font_color (color) {
  var response = document.getElementById('game-response');
  response.style.color = color;
}

function gui_write_guick_raise (text) {
  var response = document.getElementById('quick-raises');
  if (text === "") {
    response.style.visibility = 'hidden';
  } else {
    response.style.visibility = 'visible';
    response.innerHTML = text;
  }
}

function gui_hide_guick_raise () {
  gui_write_guick_raise("");
}

function gui_write_modal_box (text) {
  var modal = document.getElementById('modal-box');
  if (text === "") {
    modal.style.display = "none";
  } else {
    modal.innerHTML = text;
    modal.style.display = "block";
    modal.style.opacity = "0.90";
  }
}

function gui_initialize_css () {
  // Set all the backgrounds
  var image;
  var item;
  item = document.getElementById('poker_table');
  image = "url('static/images/poker_table.png')";
  internal_setBackground(item, image, 1.0);
}

function gui_enable_shortcut_keys (func) {
  document.addEventListener('keydown', func);
}

function gui_disable_shortcut_keys (func) {
  document.removeEventListener('keydown', func);
}

// Theme mode
function internal_get_theme_mode () {
  var mode = getLocalStorage("currentmode");
  if (mode === null) {  // first time
    mode = "light";
  }
  return mode;
}

function internal_set_theme_mode (mode) {
  setLocalStorage("currentmode", mode);
}

function gui_set_production_code_font_color (color) {
  var response = document.getElementById('production-code');
  response.style.color = color;
}

function internal_get_into_the_mode (mode) {
  var buttons = document.getElementById('setup-options');
  var mode_button = buttons.children['mode-button'];

  var color;
  var button_text;
  if (mode == "dark") {
    color = 'rgba(0, 0, 0, 0.2)';
    button_text = 'Darker';
  } else if (mode == "darker") {
    color = 'rgba(0, 0, 0, 0.5)';
    button_text = 'High contrast';
  } else if (mode == "night") {
    color = 'rgba(0, 0, 0, 0.8)';
    button_text = 'Light mode';
    gui_set_game_response_font_color('white');
    gui_set_production_code_font_color('white');
    } else {
    color = 'rgba(0, 0, 0, 0)';    
    
    button_text = 'Dark mode';
    gui_set_game_response_font_color('black');
    gui_set_production_code_font_color('black');
}
  document.body.style.background = color;
  mode_button.innerHTML = button_text;
}

function gui_initialize_theme_mode () {
  var mode = internal_get_theme_mode();
  internal_get_into_the_mode(mode);
  internal_set_theme_mode(mode);
}

function gui_toggle_the_theme_mode () {
  var mode = internal_get_theme_mode();
  if (mode == "dark") {
    mode = "darker";
  } else if (mode == "darker") {
    mode = "night";
  } else if (mode == "night") {
    mode = "light";
  } else {
    mode = "dark";
  }
  internal_get_into_the_mode(mode);
  internal_set_theme_mode(mode);
}

function gui_get_theme_mode_highlite_color () {
  var mode = internal_get_theme_mode();
  var color = "yellow";
  if (mode == "light") {
    color = "red";
  }
  return color;
}
