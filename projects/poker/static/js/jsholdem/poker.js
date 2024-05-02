/*
If you improve this software or find a bug, please let me know: orciu@users.sourceforge.net
Project home page: http://sourceforge.net/projects/jsholdem/
*/
"use strict";

//speed pitch/tempo/speed
//1.103
//10.290
var audio1 = new Audio('sounds/winner.wav');
var audio2 = new Audio('sounds/allin.wav');
var audio3 = new Audio('sounds/fold.wav');
var audio4 = new Audio('sounds/raise.wav');
var audio5 = new Audio('sounds/chips.wav');
var audio6 = new Audio('sounds/chipsmed.wav');
var audio7 = new Audio('sounds/check.wav'); 
var audio8 = new Audio('sounds/call.wav');
var START_DATE;
var NUM_ROUNDS;
var STOP_AUTOPLAY = 0;
var RUN_EM = 0;
var STARTING_BANKROLL = 500;
var SMALL_BLIND;
var BIG_BLIND;
var BG_HILITE = 'gold';           // "#EFEF30",
var global_speed = 1;
var HUMAN_WINS_AGAIN;
var HUMAN_GOES_ALL_IN;
var cards = new Array(52);
var players;
var board, deck_index, button_index;
var current_bettor_index, current_bet_amount, current_min_raise;

var mynumberofrounds = 0;
var mynumberofroundswon = 0;
var mynumberofgames = 0;
var mycurrentamount = 0;
var mydealershowonce = 0;
var mycurrentdealeris = "";
var percentcomplete = 0;
var randompokerchips = 0;
var hideallchips = 0;
var img = new Array(17);
var checkblinds = 0;
        
function getRandomArbitrary(min, max) {
    return Math.random() * (max - min) + min;
}    

function leave_pseudo_alert () {
  gui_write_modal_box("");
}

function my_pseudo_alert (text) {
  var html = "<html><body topmargin=2 bottommargin=0 bgcolor=" +
             BG_HILITE + " onload='document.f.y.focus();'>" +
             "<font>" + text +
             "</font><form name=f><input name=y type=button value='  OK  ' " +
             "onclick='parent.leave_pseudo_alert()'></form></body></html>";
 // gui_write_modal_box(html);
}

function player (name, bankroll, carda, cardb, status, total_bet,
                 subtotal_bet) {
  this.name = name;
  this.bankroll = bankroll;
  this.carda = carda;
  this.cardb = cardb;
  this.status = status;
  this.total_bet = total_bet;
  this.subtotal_bet = subtotal_bet;
}

// See stackoverflow.com/questions/16427636/check-if-localstorage-is-available
function has_local_storage () {
  try {
    var storage = window['localStorage'];
    var x = '__storage_test__';
    storage.setItem(x, x);
    storage.removeItem(x);
    return true;
  }
  catch (e) {
    return false;
  }
}

function init () {
  if (!has_local_storage()) {
    my_pseudo_alert("Your browser do not support localStorage - " +
                    "try a more modern browser like Firefox");
    return;
  }
  gui_hide_poker_table();
  gui_hide_log_window();
  gui_hide_setup_option_buttons();
  gui_hide_fold_call_click();
  gui_hide_guick_raise();
  gui_hide_dealer_button();
  gui_hide_game_response();
  gui_initialize_theme_mode();
  make_deck();
  new_game();
}

function make_deck () {
  var i;
  var j = 0;
  for (i = 2; i < 15; i++) {
    cards[j++] = "h" + i;
    cards[j++] = "d" + i;
    cards[j++] = "c" + i;
    cards[j++] = "s" + i;
  }
}

function handle_how_many_reply (opponents) {
  gui_write_modal_box("");
  write_settings_frame();
  new_game_continues(opponents);
  gui_initialize_css();         // Load background images
  gui_show_game_response();
}

function ask_how_many_opponents () {
  var quick_values = [1, 2, 3, 4, 5, 6, 7, 8, 9];
  var asking = "<b><font color=red>" +
               "So, how many opponents do you want?" +
               "</font></b><br>";
  for (var i = 0; i < 9; i++) {
    if (quick_values[i]) {
      asking += "<font>" +
                "<a href='javascript:parent.handle_how_many_reply(" +
                quick_values[i] + ")'>" + quick_values[i] +
                " </a></font>" + "&nbsp;&nbsp;&nbsp;";
    }
  }
  var html9 = "<td><table align=center><tr><td align=center>";
  var html10 = asking + "</td></tr></table></td></tr></table></body></html>";
//  gui_write_modal_box(html9 + html10);
  
  javascript:parent.handle_how_many_reply(8);
}

function initialize_game () {
  gui_hide_poker_table();
  gui_hide_dealer_button();
  gui_hide_fold_call_click();
  gui_show_poker_table();
}

function clear_player_cards (count) {
  count = count + 1; // Count that human too
  for (var pl = 0; pl < count; ++pl) {
    gui_set_player_cards("", "", pl);
    gui_set_player_name("", pl);
    gui_set_bet("", pl);
    gui_set_bankroll("", pl);
  }
}

function double_check() {

  var r = confirm("Start a new Game???");
  if (r == true) {
    new_game();
  } 
    
}

function new_game () {
//marker
     document.getElementById("avatar1").src = "avatar/_bot1_normal.png";    

     document.getElementById("avatar2").src = "avatar/_bot2_normal.png";    

     document.getElementById("avatar3").src = "avatar/_bot3_normal.png";    

     document.getElementById("avatar4").src = "avatar/_bot4_normal.png";    

     document.getElementById("avatar5").src = "avatar/_bot5_normal.png";    

     document.getElementById("avatar6").src = "avatar/_bot6_normal.png";    
 
     document.getElementById("avatar7").src = "avatar/_bot7_normal.png";    

     document.getElementById("avatar8").src = "avatar/_bot8_normal.png";
               checkblinds = 0;
               document.getElementById("seat0").style.display = "block";
               document.getElementById("seat1").style.display = "block";
               document.getElementById("seat2").style.display = "block";
               document.getElementById("seat3").style.display = "block";
               document.getElementById("seat4").style.display = "block";
               document.getElementById("seat5").style.display = "block";
               document.getElementById("seat6").style.display = "block";
               document.getElementById("seat7").style.display = "block";
               document.getElementById("seat8").style.display = "block"; 
               document.getElementById("seat9").style.display = "block";
for (var x = 0; x < 20; x++)
{
  document.getElementById("mypokerchipred" + x).style.display = "none";   
  document.getElementById("mypokerchipgreen" + x).style.display = "none"; 
  document.getElementById("mypokerchipblue" + x).style.display = "none"; 
  document.getElementById("mypokerchipblack" + x).style.display = "none"; 
  document.getElementById("mypokerchipgold" + x).style.display = "none"; 
}
  randompokerchips = 0; 
  START_DATE = new Date();
  NUM_ROUNDS = 0;
  HUMAN_WINS_AGAIN = 0;
  mynumberofgames++;
  mynumberofrounds = 0;
  mynumberofroundswon = 0;
  var getmycurrenttime = new Date().toLocaleString();
  var gamenumber = "[" + getmycurrenttime + "] " + "<font color='blue'>Game</font>: " + mynumberofgames + "<hr>";
 // gui_log_to_history(gamenumber); 
  initialize_game();
  ask_how_many_opponents();
  checktable();


}

function new_game_continues (req_no_opponents) {
  var my_players = [
                    new player("Olivia", 0, "", "", "", 0, 0),
                    new player("Emma", 0, "", "", "", 0, 0),
                    new player("Eva", 0, "", "", "", 0, 0),
                    new player("Sophia", 0, "", "", "", 0, 0),
                    new player("Isabella", 0, "", "", "", 0, 0),
                    new player("Charlotte", 0, "", "", "", 0, 0),
                    new player("Amelia", 0, "", "", "", 0, 0),
                    new player("Mia", 0, "", "", "", 0, 0),
                    new player("Harper", 0, "", "", "", 0, 0)
                   ];

  players = new Array(req_no_opponents + 1);
  var player_name = getLocalStorage("playername");
  if (!player_name) {
    player_name = "You";
  }
  players[0] = new player(player_name, 0, "", "", "", 0, 0);

  
  //my_players.sort(compRan);
  var i;
  //for (i = 1; i < players.length; i++) {
  //  players[i] = my_players[i - 1];
  //}
  var mybot1 = botarray[0];
  var mybot2 = botarray[1];
  var mybot3 = botarray[2];
  var mybot4 = botarray[3];
  var mybot5 = botarray[4];
  var mybot6 = botarray[5];
  var mybot7 = botarray[6];
  var mybot8 = botarray[7];
  players[1] = my_players[mybot1 -1];
  players[2] = my_players[mybot2 -1];
  players[3] = my_players[mybot3 -1];
  players[4] = my_players[mybot4 -1];
  players[5] = my_players[mybot5 -1];
  players[6] = my_players[mybot6 -1];
  players[7] = my_players[mybot7 -1];
  players[8] = my_players[mybot8 -1];  
  
  
  
  
  
  clear_player_cards(my_players.length);
  reset_player_statuses(0);
  clear_bets();
  for (i = 0; i < players.length; i++) {
    players[i].bankroll = STARTING_BANKROLL;
    
    
    
    
    
    
    
    
    
    
    
  }
  button_index = Math.floor(Math.random() * players.length);
  new_round();
}

function number_of_active_players () {
  var num_playing = 0;
  var i;
  for (i = 0; i < players.length; i++) {
    if (has_money(i)) {
      num_playing += 1;
    }
  }
  return num_playing;
}

function new_round () {
  RUN_EM = 0;
  NUM_ROUNDS++;
  // Clear buttons
  gui_hide_fold_call_click();

  var num_playing = number_of_active_players();
  if (num_playing < 2) {
    gui_setup_fold_call_click("Start a new game",
                              0,
                              new_game,
                              new_game);
    return;
  }
  HUMAN_GOES_ALL_IN = 0;
  reset_player_statuses(1);
  clear_bets();
  clear_pot();
  current_min_raise = 0;
  collect_cards();
  button_index = get_next_player_position(button_index, 1);
  var i;
  for (i = 0; i < players.length; i++) {
    write_player(i, 0, 0);
  }

  for (i = 0; i < board.length; i++) {
    if (i > 4) {        // board.length != 5
      continue;
    }
    board[i] = "";
    gui_lay_board_card(i, board[i]);     // Clear the board
  }
  for (i = 0; i < 3; i++) {
    board[i] = "";
    gui_burn_board_card(i, board[i]);
  }
  mynumberofrounds++;
//marker
for (var x = 0; x < 20; x++)
{
  document.getElementById("mypokerchipred" + x).style.display = "none";   
  document.getElementById("mypokerchipgreen" + x).style.display = "none"; 
  document.getElementById("mypokerchipblue" + x).style.display = "none"; 
  document.getElementById("mypokerchipblack" + x).style.display = "none";    
  document.getElementById("mypokerchipgold" + x).style.display = "none"; 
}
  randompokerchips = 0;  
  
      document.getElementById("avatar1").src = "avatar/_bot1_normal.png";    

     document.getElementById("avatar2").src = "avatar/_bot2_normal.png";    

     document.getElementById("avatar3").src = "avatar/_bot3_normal.png";    

     document.getElementById("avatar4").src = "avatar/_bot4_normal.png";    

     document.getElementById("avatar5").src = "avatar/_bot5_normal.png";    

     document.getElementById("avatar6").src = "avatar/_bot6_normal.png";    
 
     document.getElementById("avatar7").src = "avatar/_bot7_normal.png";    

     document.getElementById("avatar8").src = "avatar/_bot8_normal.png"; 
       
               document.getElementById("mybet").style.background = "black";
               document.getElementById("bbet1").style.background = "black";
        
               document.getElementById("bbet2").style.background = "black";
            
               document.getElementById("bbet3").style.background = "black";
          
               document.getElementById("bbet4").style.background = "black";
           
               document.getElementById("bbet5").style.background = "black";
          
               document.getElementById("bbet6").style.background = "black";
            
               document.getElementById("bbet7").style.background = "black";
           
               document.getElementById("bbet8").style.background = "black"; 
            
               document.getElementById("bbet9").style.background = "black";  
               
           
  var message = "<b>New round</b>&nbsp;&nbsp;";
  checkblinds = 0;
  var getmycurrenttime = new Date().toLocaleString();
  mycurrentamount = players[0].bankroll - 500;
  var calcpercentage = ((mycurrentamount * 100) / 4000);
  if (calcpercentage < 0)
  calcpercentage = 0;
  var tperc = Math.trunc(calcpercentage);
  document.getElementById("myprogress").value = tperc;
  percentcomplete = "[" + getmycurrenttime + "] " + "<font color='orange'>Status Progress</font>: " + tperc + "%<br>";
  var mydealris = "[" + getmycurrenttime + "] " + "<font color='red'>Dealer is</font>: " + mycurrentdealeris + "<br>"; 
  var winningstringtotal = "<font color='green'>Cash Amount</font>: $" + players[0].bankroll + " (+: " + mycurrentamount + ")";   
  var numberofroundsstring =  percentcomplete + mydealris + "[" + getmycurrenttime + "] " + winningstringtotal + " " + "<font color='blue'>Round:</font> " + mynumberofrounds;
 // gui_log_to_history(numberofroundsstring);
  gui_write_game_response(message);
  gui_hide_guick_raise();
  shuffle();
  blinds_and_deal();
  checktable();
}

function collect_cards () {
  board = new Array(6);
  for (var i = 0; i < players.length; i++) {
    players[i].carda = "";
    players[i].cardb = "";
  }
}

function new_shuffle () {
  function get_random_int (max) {
    return Math.floor(Math.random() * max);
  }
  var len = cards.length;
  for (var i = 0; i < len; ++i) {
    var j = i + get_random_int(len - i);
    var tmp = cards[i];
    cards[i] = cards[j];
    cards[j] = tmp;
  }
}

function shuffle () {
  new_shuffle();
  deck_index = 0;
}

function blinds_and_deal () {
  SMALL_BLIND = 5;
  BIG_BLIND = 10;
  var num_playing = number_of_active_players();
  if (num_playing == 3) {
    SMALL_BLIND = 10;
    BIG_BLIND = 20;
  } else if (num_playing < 3) {
    SMALL_BLIND = 25;
    BIG_BLIND = 50;
  }
  var small_blind = get_next_player_position(button_index, 1);
  the_bet_function(small_blind, SMALL_BLIND);
  write_player(small_blind, 0, 0);
  var big_blind = get_next_player_position(small_blind, 1);
  the_bet_function(big_blind, BIG_BLIND);
  write_player(big_blind, 0, 0);
  players[big_blind].status = "OPTION";
  current_bettor_index = get_next_player_position(big_blind, 1);
  deal_and_write_a();
}

function unroll_player (starting_player, player_pos, final_call) {
  var next_player = get_next_player_position(player_pos, 1);
  write_player(player_pos, 0, 0);
  if (starting_player == next_player) {
    setTimeout(final_call, 550 * global_speed);
  } else {
    setTimeout(unroll_player, 550 * global_speed,
               starting_player, next_player, final_call);
  }
}

function deal_and_write_a () {
  var current_player;
  var start_player;

  start_player = current_player = get_next_player_position(button_index, 1);
  // Deal cards to players still active
  do {
    players[current_player].carda = cards[deck_index++];
    current_player = get_next_player_position(current_player, 1);
  } while (current_player != start_player);

  // and now show the cards
  current_player = get_next_player_position(button_index, 1);
  unroll_player(current_player, current_player, deal_and_write_b);
}

// Make a small delay before starting the bets
function delay_for_main () {
  setTimeout(main, 1000);
}

function deal_and_write_b () {
  var current_player = button_index;
  for (var i = 0; i < players.length; i++) {
    current_player = get_next_player_position(current_player, 1);
    if (players[current_player].cardb) {
      break;
    }
    players[current_player].cardb = cards[deck_index++];
  }

  current_player = get_next_player_position(button_index, 1);
  unroll_player(current_player, current_player, delay_for_main);
}

function go_to_betting () {
  if (get_num_betting() > 1) {
    setTimeout(main, 1000 * global_speed);
  } else {
    setTimeout(ready_for_next_card, 1000 * global_speed);
  }
}

function unroll_table (last_pos, current_pos, final_call) {
  gui_lay_board_card(current_pos, board[current_pos]);

  if (current_pos == last_pos) {
    setTimeout(final_call, 150 * global_speed);
  } else {
    setTimeout(unroll_table, 150 * global_speed,
               last_pos, current_pos + 1, final_call);
  }
}

function deal_flop () {
  var burn = cards[deck_index++];
  gui_burn_board_card(0, burn);
  var message = "<b>Dealing flop</b>&nbsp;&nbsp;";
  gui_write_game_response(message);
  for (var i = 0; i < 3; i++) {
    board[i] = cards[deck_index++];
  }

  // Place 3 first cards
  setTimeout(unroll_table, 1000, /*last_pos*/2, /*start_pos*/0, go_to_betting);
}

function deal_fourth () {
  var burn = cards[deck_index++];
  gui_burn_board_card(1, burn);
  var message = "<b>Dealing turn</b>&nbsp;&nbsp;";
  gui_write_game_response(message);
  board[3] = cards[deck_index++];

  // Place 4th card
  setTimeout(unroll_table, 1000, /*last_pos*/3, /*start_pos*/3, go_to_betting);
}

function deal_fifth () {
  var burn = cards[deck_index++];
  gui_burn_board_card(2, burn);
  var message = "<b>Dealing river</b>&nbsp;&nbsp;";
  gui_write_game_response(message);
  board[4] = cards[deck_index++];

  // Place 5th card
  setTimeout(unroll_table, 1000, /*last_pos*/4, /*start_pos*/4, go_to_betting);
}

function main () {
  gui_hide_guick_raise();
  var increment_bettor_index = 0;
  if (players[current_bettor_index].status == "BUST" ||
      players[current_bettor_index].status == "FOLD") {
    increment_bettor_index = 1;
  } else if (!has_money(current_bettor_index)) {
    players[current_bettor_index].status = "CALL";
      
    increment_bettor_index = 1;
  } else if (players[current_bettor_index].status == "CALL" &&
             players[current_bettor_index].subtotal_bet == current_bet_amount) {
    increment_bettor_index = 1;
  } else {
    players[current_bettor_index].status = "";
    if (current_bettor_index == 0) {
      var fold_button_text = "<u>F</u>old";
      var to_call = current_bet_amount - players[0].subtotal_bet;
      var call_button_text = "<u>C</u>all" + " $" + to_call;
      if (to_call > players[0].bankroll) {
        to_call = players[0].bankroll;
      }
      var that_is_not_the_key_you_are_looking_for;
      if (to_call == 0) {
        call_button_text = "<u>C</u>heck";
        fold_button_text = 0;
        that_is_not_the_key_you_are_looking_for = function (key) {
          if (key == 67) {         // Check
            human_call();
          } else {
            return true;           // Not my business
          }
          return false;
        };
      } else {
        that_is_not_the_key_you_are_looking_for = function (key) {
          if (key == 67) {         // Call
            human_call();
          } else if (key == 70) {  // Fold
            human_fold();
          } else {
            return true;           // Not my business
          }
          return false;
        };
      }
      // Fix the shortcut keys - structured and simple
      // Called through a key event
      var ret_function = function (key_event) {
        actual_function(key_event.keyCode, key_event);
      }

      // Called both by a key press and click on button.
      // Why? Because we want to disable the shortcut keys when done
      var actual_function = function (key, key_event) {
        if (that_is_not_the_key_you_are_looking_for(key)) {
          return;
        }
        gui_disable_shortcut_keys(ret_function);
        if (key_event != null) {
          key_event.preventDefault();
        }
      };

      // And now set up so the key click also go to 'actual_function'
      var do_fold = function () {
        actual_function(70, null);
      };
      var do_call = function () {
        actual_function(67, null);
      };
      // Trigger the shortcut keys
      gui_enable_shortcut_keys(ret_function);

      // And enable the buttons
      gui_setup_fold_call_click(fold_button_text,
                                call_button_text,
                                do_fold,
                                do_call);

      var quick_values = new Array(6);
      if (to_call < players[0].bankroll) {
        quick_values[0] = current_min_raise;
      }
      var quick_start = quick_values[0];
      if (quick_start < 20) {
        quick_start = 20;
      } else {
        quick_start = current_min_raise + 20;
      }
      var i;
      for (i = 0; i < 5; i++) {
        if (quick_start + 20 * i < players[0].bankroll) {
          quick_values[i + 1] = quick_start + 20 * i;
        }
      }
      var bet_or_raise = "Bet";
      if (to_call > 0) {
        bet_or_raise = "Raise";
        
        //top: 180px;
        //left: 140px;
        //top: 260px;
        //left: 550px;
        
            //chipsmarkers
          
         
        
      }
      var quick_bets = "";
      for (i = 0; i < 6; i++) {
        if (quick_values[i]) {
          quick_bets += "<a href='javascript:parent.handle_human_bet(" +
                        quick_values[i] + ")' class= 'grad"+ i +"'>" + quick_values[i] + "</a>" +
                        "";
        }
      }
      quick_bets += "<a href='javascript:parent.handle_human_bet(" +
                    players[0].bankroll + ")' class='grad6'>All In!</a>";
      var html9 = "<td><table align=center><tr><td align=center>";
      var html10 = quick_bets +
                   "</td></tr></table></td></tr></table></body></html>";
      gui_write_guick_raise(html9 + html10);

      var hi_lite_color = gui_get_theme_mode_highlite_color();
      var message = "<b>Current raise: " +
                    current_bet_amount +
                    "</b>&nbsp;&nbsp;You need <font color=" + hi_lite_color +
                    " style=''><b>" + to_call +
                    "</b></font> more to call.&nbsp;&nbsp;";
      gui_write_game_response(message);
      
      write_player(0, 1, 0);
      return;
    } else {
      write_player(current_bettor_index, 1, 0);
      setTimeout(bet_from_bot, 777 * global_speed, current_bettor_index);
      return;
    }
  }
  var can_break = true;
  for (var j = 0; j < players.length; j++) {
    var s = players[j].status;
    if (s == "OPTION") {
      can_break = false;
      break;
    }
    if (s != "BUST" && s != "FOLD") {
      if (has_money(j) && players[j].subtotal_bet < current_bet_amount) {
        can_break = false;
        break;
      }
    }
  }
  if (increment_bettor_index) {
    current_bettor_index = get_next_player_position(current_bettor_index, 1);
  }
  if (can_break) {
    setTimeout(ready_for_next_card, 999 * global_speed);
  } else {
    setTimeout(main, 999 * global_speed);
  }
}

var global_pot_remainder = 0;

function handle_end_of_round () {
  var candidates = new Array(players.length);
  var allocations = new Array(players.length);
  var winning_hands = new Array(players.length);
  var my_total_bets_per_player = new Array(players.length);

  // Clear the ones that folded or are busted
  var i;
  var still_active_candidates = 0;
  for (i = 0; i < candidates.length; i++) {
    allocations[i] = 0;
    my_total_bets_per_player[i] = players[i].total_bet;
    if (players[i].status != "FOLD" && players[i].status != "BUST") {
      candidates[i] = players[i];
      still_active_candidates += 1;
    }
  }

  var my_total_pot_size = get_pot_size();
  var my_best_hand_name = "";
  var best_hand_players;
  var current_pot_to_split = 0;
  var pot_remainder = 0;
  if (global_pot_remainder) {
   // gui_log_to_history("transferring global pot remainder " + global_pot_remainder);
    pot_remainder = global_pot_remainder;
    my_total_pot_size += global_pot_remainder;
    global_pot_remainder = 0;
  }

  while (my_total_pot_size > (pot_remainder + 0.9) && still_active_candidates) {
//    gui_log_to_history("splitting pot with pot " + my_total_pot_size +
//                       " and remainder " + pot_remainder +
//                       " on " + still_active_candidates + " candidates" );

    // The first round all who not folded or busted are candidates
    // If that/ose winner(s) cannot get all of the pot then we try
    // with the remaining players until the pot is emptied
    var winners = get_winners(candidates);
    if (!best_hand_players) {
      best_hand_players = winners;
    }
    if (!winners) {
//      gui_log_to_history("no winners");
      my_pseudo_alert("No winners for the pot ");
      pot_remainder = my_total_pot_size;
      my_total_pot_size = 0;
      break;
    }

    // Get the lowest winner bet, e.g. an all-in
    var lowest_winner_bet = my_total_pot_size * 2;
    var num_winners = 0;
    for (i = 0; i < winners.length; i++) {
      if (!winners[i]) { // Only the winners bets
        continue;
      }
      if (!my_best_hand_name) {
        my_best_hand_name = winners[i]["hand_name"];
      }
      num_winners++;
      if (my_total_bets_per_player[i] < lowest_winner_bet) {
        lowest_winner_bet = my_total_bets_per_player[i];
      }
    }

    // Compose the pot
    // If your bet was less than (a fold) or equal to the lowest winner bet:
    //    then add it to the current pot
    // If your bet was greater than lowest:
    //    then just take the 'lowest_winner_bet' to the pot

    // Take in any fraction from a previous split
//    if (pot_remainder) {
//      gui_log_to_history("increasing current pot with remainder " + pot_remainder);
//    }
    current_pot_to_split = pot_remainder;
    pot_remainder = 0;

    for (i = 0; i < players.length; i++) {
      if (lowest_winner_bet >= my_total_bets_per_player[i]) {
        current_pot_to_split += my_total_bets_per_player[i];
        my_total_bets_per_player[i] = 0;
      } else {
        current_pot_to_split += lowest_winner_bet;
        my_total_bets_per_player[i] -= lowest_winner_bet;
      }
    }

    // Divide the pot - in even integrals
//    gui_log_to_history("Divide the pot " + current_pot_to_split +
//                       " on " + num_winners + " winner(s)");
    var share = Math.floor(current_pot_to_split / num_winners);
    // and save any remainders to next round
    pot_remainder = current_pot_to_split - share * num_winners;

//    gui_log_to_history("share " + share + " remainder " + pot_remainder);

    for (i = 0; i < winners.length; i++) {
      if (my_total_bets_per_player[i] < 0.01) {
        candidates[i] = null;           // You have got your share
      }
      if (!winners[i]) {                // You should not have any
        continue;
      }
      my_total_pot_size -= share;       // Take from the pot
      allocations[i] += share;          // and give to the winners
      winning_hands[i] = winners[i].hand_name;
    }

    // Iterate until pot size is zero - or no more candidates
    for (i = 0; i < candidates.length; i++) {
      if (candidates[i] == null) {
        continue;
      }
      still_active_candidates += 1
    }
    if (still_active_candidates == 0) {
      pot_remainder = my_total_pot_size;
//      gui_log_to_history("no more candidates, pot_remainder " + pot_remainder);
    }
    var getmycurrenttime = new Date().toLocaleString();
  
 //   gui_log_to_history( "[" + getmycurrenttime + "] " + "End of Round");

    mydealershowonce = 0;
    

  } // End of pot distribution

  global_pot_remainder = pot_remainder;
//  gui_log_to_history("distributed; global_pot_remainder: " +
//                     global_pot_remainder +
//                     " pot_remainder: " + pot_remainder);
  pot_remainder = 0;
  var winner_text = "";
  var human_loses = 0;
  // Distribute the pot - and then do too many things
  for (i = 0; i < allocations.length; i++) {
    if (allocations[i] > 0) {
      var a_string = "" + allocations[i];
      var dot_index = a_string.indexOf(".");
      if (dot_index > 0) {
        a_string = "" + a_string + "00";
        allocations[i] = a_string.substring(0, dot_index + 3) - 0;
      }
      winner_text += winning_hands[i] + " gives " + allocations[i] +
                     " to " + players[i].name + ". ";
      players[i].bankroll += allocations[i];
      if (best_hand_players[i]) {
        // function write_player(n, hilite, show_cards)
        write_player(i, 2, 1);
      } else {
        write_player(i, 1, 1);
      }
    } else {
      if (!has_money(i) && players[i].status != "BUST") {
        players[i].status = "BUST";
        if (i == 0) {
          human_loses = 1;
        }
      }
      if (players[i].status != "FOLD") {
        write_player(i, 0, 1);
      }
    }
  }
  // Have a more liberal take on winning
  if (allocations[0] > 5) {
    HUMAN_WINS_AGAIN++;
            audio1.play();
            audio5.play();
  mynumberofroundswon++;
  var getmycurrenttime = new Date().toLocaleString();
  var winningstring =   "[" + getmycurrenttime + "] " + "<font color='blue'>Game</font>: " + mynumberofgames + ", <font color='blue'>You win this round</font>: " + mynumberofroundswon + "/" + mynumberofrounds;
 // gui_log_to_history(winningstring);
       document.getElementById("avatar1").src = "avatar/_bot1_normal.png"; 
       document.getElementById("avatar2").src = "avatar/_bot2_normal.png";
       document.getElementById("avatar3").src = "avatar/_bot3_normal.png";
       document.getElementById("avatar4").src = "avatar/_bot4_normal.png";
       document.getElementById("avatar5").src = "avatar/_bot5_normal.png";
       document.getElementById("avatar6").src = "avatar/_bot6_normal.png";
       document.getElementById("avatar7").src = "avatar/_bot7_normal.png";
       document.getElementById("avatar8").src = "avatar/_bot8_normal.png";    
  } else {
    HUMAN_WINS_AGAIN = 0;

    
    
    
  
  }

  var detail = "";
  for (i = 0; i < players.length; i++) {
    if (players[i].total_bet == 0 && players[i].status == "BUST") {
      continue;  // Skip busted players
    }
    detail += players[i].name + " bet " + players[i].total_bet + " & got " +
              allocations[i] + ".\\n";
  }
  detail = " (<a href='javascript:alert(\"" + detail + "\")'>details</a>)";

  var quit_text = "Restart";
  var quit_func = double_check;
  var continue_text = "Go on";
  var continue_func = new_round;

  if (players[0].status == "BUST" && !human_loses) {
    continue_text = 0;
    quit_func = function () {
    parent.STOP_AUTOPLAY = 1;
    mydealershowonce = 0;
    };
    setTimeout(autoplay_new_round, 1500 + 1100 * global_speed);
  }

  var num_playing = number_of_active_players();
  if (num_playing < 2) {
    // Convoluted way of finding the active player and give him the pot
    for (i = 0; i < players.length; i++) {
      // For whosoever hath, to him shall be given
      if (has_money(i)) {
        players[i].bankroll += pot_remainder;
        pot_remainder = 0;
      }
    }
  }
  if (pot_remainder) {
    var local_text = "There is " + pot_remainder + " put into next pot\n";
    detail += local_text;
  }
  var hi_lite_color = gui_get_theme_mode_highlite_color();
  var html = "<html><body bgcolor=" + BG_HILITE +
             " onload='document.f.c.focus();'>" +
             get_pot_size_html() +
             "&nbsp;&nbsp;<font color=" + hi_lite_color +
             "><b>Winning: " +
             winner_text + "</b></font>" + detail + "&nbsp;&nbsp;";
  gui_write_game_response(html);

  gui_setup_fold_call_click(quit_text,
                            continue_text,
                            quit_func,
                            continue_func);

  var elapsed_milliseconds = ((new Date()) - START_DATE);
  var elapsed_time = makeTimeString(elapsed_milliseconds);

  if (human_loses == 1) {
    var ending = NUM_ROUNDS == 1 ? "1 deal." : NUM_ROUNDS + " deals.";
    my_pseudo_alert("Sorry, you busted " + players[0].name + ".\n\n" +
                    elapsed_time + ", " + ending);
  } else {
    num_playing = number_of_active_players();
    if (num_playing < 2) {
      var end_msg = "GAME OVER!";
      var over_ending = NUM_ROUNDS == 1 ? "1 deal." : NUM_ROUNDS + " deals.";
      if (has_money(0)) {
        end_msg += "\n\nYOU WIN " + players[0].name.toUpperCase() + "!!!";
            audio1.play();
            audio5.play();
       document.getElementById("avatar1").src = "avatar/_bot1_normal.png"; 
       document.getElementById("avatar2").src = "avatar/_bot2_normal.png";
       document.getElementById("avatar3").src = "avatar/_bot3_normal.png";
       document.getElementById("avatar4").src = "avatar/_bot4_normal.png";
       document.getElementById("avatar5").src = "avatar/_bot5_normal.png";
       document.getElementById("avatar6").src = "avatar/_bot6_normal.png";
       document.getElementById("avatar7").src = "avatar/_bot7_normal.png";
       document.getElementById("avatar8").src = "avatar/_bot8_normal.png";
   
      } else {
        end_msg += "\n\nSorry, you lost.";
      }
      my_pseudo_alert(end_msg + "\n\nThis game lasted " + elapsed_time + ", " +
                      over_ending);
    }
  }
}

function autoplay_new_round () {

     document.getElementById("avatar1").src = "avatar/_bot1_normal.png";    

     document.getElementById("avatar2").src = "avatar/_bot2_normal.png";    

     document.getElementById("avatar3").src = "avatar/_bot3_normal.png";    

     document.getElementById("avatar4").src = "avatar/_bot4_normal.png";    

     document.getElementById("avatar5").src = "avatar/_bot5_normal.png";    

     document.getElementById("avatar6").src = "avatar/_bot6_normal.png";    
 
     document.getElementById("avatar7").src = "avatar/_bot7_normal.png";    

     document.getElementById("avatar8").src = "avatar/_bot8_normal.png";    
  
  if (STOP_AUTOPLAY > 0) {
    STOP_AUTOPLAY = 0;
    mydealershowonce = 0;
    checkblinds = 0;
    new_game();
  } else {
    mydealershowonce = 0;
    new_round();
  }
}

function ready_for_next_card () {
  var num_betting = get_num_betting();
  var i;
  for (i = 0; i < players.length; i++) {
    players[i].total_bet += players[i].subtotal_bet;
    
    
                 
    
    
    
    
    
  }
  clear_bets();
  if (board[4]) {
    handle_end_of_round();
    return;
  }
  current_min_raise = BIG_BLIND;
  reset_player_statuses(2);
  if (players[button_index].status == "FOLD") {
    players[get_next_player_position(button_index, -1)].status = "OPTION";
  } else {
    players[button_index].status = "OPTION";
  }
  current_bettor_index = get_next_player_position(button_index, 1);
  var show_cards = 0;
  if (num_betting < 2) {
    show_cards = 1;
  }

  if (!RUN_EM) {
    for (i = 0; i < players.length; i++) { // <-- UNROLL
      if (players[i].status != "BUST" && players[i].status != "FOLD") {
        write_player(i, 0, show_cards);
      }
    }
  }

  if (num_betting < 2) {
    RUN_EM = 1;
  }
  if (!board[0]) {
    deal_flop();
  } else if (!board[3]) {
    deal_fourth();
  } else if (!board[4]) {
    deal_fifth();
  }
}

function the_bet_function (player_index, bet_amount) {
  if (players[player_index].status == "FOLD") {
    return 0;
    // FOLD ;
  } else if (bet_amount >= players[player_index].bankroll) { // ALL IN
    audio2.play();
    bet_amount = players[player_index].bankroll;

    var old_current_bet = current_bet_amount;

    if (players[player_index].subtotal_bet + bet_amount > current_bet_amount) {
      current_bet_amount = players[player_index].subtotal_bet + bet_amount;
    }
    
                  
    
    
    

    // current_min_raise should be calculated earlier ? <--
    var new_current_min_raise = current_bet_amount - old_current_bet;
    if (new_current_min_raise > current_min_raise) {
      current_min_raise = new_current_min_raise;
    }
    players[player_index].status = "CALL";
               if (player_index == 0)
               document.getElementById("mybet").style.background = "lawngreen";
               if (player_index == 1)
               document.getElementById("bbet1").style.background = "lawngreen";
               if (player_index == 2)
               document.getElementById("bbet2").style.background = "lawngreen";
               if (player_index == 3)
               document.getElementById("bbet3").style.background = "lawngreen";
               if (player_index == 4)
               document.getElementById("bbet4").style.background = "lawngreen";
               if (player_index == 5)
               document.getElementById("bbet5").style.background = "lawngreen";
               if (player_index == 6)
               document.getElementById("bbet6").style.background = "lawngreen";
               if (player_index == 7)
               document.getElementById("bbet7").style.background = "lawngreen";
               if (player_index == 8)
               document.getElementById("bbet8").style.background = "lawngreen";
               if (player_index == 9)
               document.getElementById("bbet9").style.background = "lawngreen";
               
             
               
               
  } else if (bet_amount + players[player_index].subtotal_bet ==
             current_bet_amount) { // CALL
    players[player_index].status = "CALL";
               if (player_index == 0)
               document.getElementById("mybet").style.background = "lawngreen";
               if (player_index == 1)
               document.getElementById("bbet1").style.background = "lawngreen";
               if (player_index == 2)
               document.getElementById("bbet2").style.background = "lawngreen";
               if (player_index == 3)
               document.getElementById("bbet3").style.background = "lawngreen";
               if (player_index == 4)
               document.getElementById("bbet4").style.background = "lawngreen";
               if (player_index == 5)
               document.getElementById("bbet5").style.background = "lawngreen";
               if (player_index == 6)
               document.getElementById("bbet6").style.background = "lawngreen";
               if (player_index == 7)
               document.getElementById("bbet7").style.background = "lawngreen";
               if (player_index == 8)
               document.getElementById("bbet8").style.background = "lawngreen";
               if (player_index == 9)
               document.getElementById("bbet9").style.background = "lawngreen";
               

     
  } else if (current_bet_amount >
             players[player_index].subtotal_bet + bet_amount) { // 2 SMALL
    // COMMENT OUT TO FIND BUGS
               if (player_index == 0)
               document.getElementById("mybet").style.background = "lawngreen";
               if (player_index == 1)
               document.getElementById("bbet1").style.background = "lawngreen";
               if (player_index == 2)
               document.getElementById("bbet2").style.background = "lawngreen";
               if (player_index == 3)
               document.getElementById("bbet3").style.background = "lawngreen";
               if (player_index == 4)
               document.getElementById("bbet4").style.background = "lawngreen";
               if (player_index == 5)
               document.getElementById("bbet5").style.background = "lawngreen";
               if (player_index == 6)
               document.getElementById("bbet6").style.background = "lawngreen";
               if (player_index == 7)
               document.getElementById("bbet7").style.background = "lawngreen";
               if (player_index == 8)
               document.getElementById("bbet8").style.background = "lawngreen";
               if (player_index == 9)
               document.getElementById("bbet9").style.background = "lawngreen";
               
               
               
    if (player_index == 0) {
      my_pseudo_alert("The current bet to match is " + current_bet_amount +
                      "\nYou must bet a total of at least " +
                      (current_bet_amount - players[player_index].subtotal_bet) +
                      " or fold.");
    }
    return 0;
  } else if (bet_amount + players[player_index].subtotal_bet >
             current_bet_amount && // RAISE 2 SMALL
             get_pot_size() > 0 &&
             bet_amount + players[player_index].subtotal_bet - current_bet_amount < current_min_raise) {
    // COMMENT OUT TO FIND BUGS
               if (player_index == 0)
               document.getElementById("mybet").style.background = "lawngreen";
               if (player_index == 1)
               document.getElementById("bbet1").style.background = "lawngreen";
               if (player_index == 2)
               document.getElementById("bbet2").style.background = "lawngreen";
               if (player_index == 3)
               document.getElementById("bbet3").style.background = "lawngreen";
               if (player_index == 4)
               document.getElementById("bbet4").style.background = "lawngreen";
               if (player_index == 5)
               document.getElementById("bbet5").style.background = "lawngreen";
               if (player_index == 6)
               document.getElementById("bbet6").style.background = "lawngreen";
               if (player_index == 7)
               document.getElementById("bbet7").style.background = "lawngreen";
               if (player_index == 8)
               document.getElementById("bbet8").style.background = "lawngreen";
               if (player_index == 9)
               document.getElementById("bbet9").style.background = "lawngreen";
               

    if (player_index == 0) {
      my_pseudo_alert("Minimum raise is currently " + current_min_raise + ".");
    }
    return 0;
  } else { // RAISE
    players[player_index].status = "CALL";
               if (player_index == 0)
               document.getElementById("mybet").style.background = "lawngreen";
               if (player_index == 1)
               document.getElementById("bbet1").style.background = "lawngreen";
               if (player_index == 2)
               document.getElementById("bbet2").style.background = "lawngreen";
               if (player_index == 3)
               document.getElementById("bbet3").style.background = "lawngreen";
               if (player_index == 4)
               document.getElementById("bbet4").style.background = "lawngreen";
               if (player_index == 5)
               document.getElementById("bbet5").style.background = "lawngreen";
               if (player_index == 6)
               document.getElementById("bbet6").style.background = "lawngreen";
               if (player_index == 7)
               document.getElementById("bbet7").style.background = "lawngreen";
               if (player_index == 8)
               document.getElementById("bbet8").style.background = "lawngreen";
               if (player_index == 9)
               document.getElementById("bbet9").style.background = "lawngreen";
               
                        
               
               
    var previous_current_bet = current_bet_amount;
    current_bet_amount = players[player_index].subtotal_bet + bet_amount;

    if (get_pot_size() > 0) {
      current_min_raise = current_bet_amount - previous_current_bet;
      if (current_min_raise < BIG_BLIND) {
        current_min_raise = BIG_BLIND;
      }
    }
  }
  players[player_index].subtotal_bet += bet_amount;
  players[player_index].bankroll -= bet_amount;

      
               checkblinds++;
               if (player_index == 0 && players[0].subtotal_bet == 0 && checkblinds > 3)
               {
               document.getElementById("mybet").style.background = "orange";
               audio7.play();
               }
               if (player_index == 1 && players[1].subtotal_bet == 0 && checkblinds > 3)
               {
               $("#botspeech1").text("I check...");
               var avatarname = "avatar" + botarray[0];
               var avatarimage = "avatar/_bot" + botarray[0] + "_call.png"
               document.getElementById(avatarname).src = avatarimage;
               $("#botspeech1").show().delay(5000).fadeOut();
               document.getElementById("bbet1").style.background = "orange";
               audio7.play();
               }
               if (player_index == 2 && players[2].subtotal_bet == 0 && checkblinds > 3)
               {
               var avatarname = "avatar" + botarray[1];
               var avatarimage = "avatar/_bot" + botarray[1] + "_call.png"
               document.getElementById(avatarname).src = avatarimage;
               $("#botspeech2").text("I check...");
               $("#botspeech2").show().delay(5000).fadeOut();
               document.getElementById("bbet2").style.background = "orange";
               audio7.play();
               }
               if (player_index == 3 && players[3].subtotal_bet == 0 && checkblinds > 3)
               {
               var avatarname = "avatar" + botarray[2];
               var avatarimage = "avatar/_bot" + botarray[2] + "_call.png"
               document.getElementById(avatarname).src = avatarimage;
               $("#botspeech3").text("I check...");
               $("#botspeech3").show().delay(5000).fadeOut();
               document.getElementById("bbet3").style.background = "orange";
               audio7.play();
               }
               if (player_index == 4 && players[4].subtotal_bet == 0 && checkblinds > 3)
               {
               var avatarname = "avatar" + botarray[3];
               var avatarimage = "avatar/_bot" + botarray[3] + "_call.png"
               document.getElementById(avatarname).src = avatarimage;
               $("#botspeech4").text("I check...");
               $("#botspeech4").show().delay(5000).fadeOut();
               document.getElementById("bbet4").style.background = "orange";
               audio7.play();
               }
               if (player_index == 5 && players[5].subtotal_bet == 0 && checkblinds > 3)
               {
               var avatarname = "avatar" + botarray[4];
               var avatarimage = "avatar/_bot" + botarray[4] + "_call.png"
               document.getElementById(avatarname).src = avatarimage;
               $("#botspeech5").text("I check...");
               $("#botspeech5").show().delay(5000).fadeOut();
               document.getElementById("bbet5").style.background = "orange";
               audio7.play();
               }
               if (player_index == 6 && players[6].subtotal_bet == 0 && checkblinds > 3)
               {
               var avatarname = "avatar" + botarray[5];
               var avatarimage = "avatar/_bot" + botarray[5] + "_call.png"
               document.getElementById(avatarname).src = avatarimage;
               $("#botspeech6").text("I check...");
               $("#botspeech6").show().delay(5000).fadeOut();
               document.getElementById("bbet6").style.background = "orange";
               audio7.play();
               }
               if (player_index == 7 && players[7].subtotal_bet == 0 && checkblinds > 3)
               {
               var avatarname = "avatar" + botarray[6];
               var avatarimage = "avatar/_bot" + botarray[6] + "_call.png"
               document.getElementById(avatarname).src = avatarimage;
               $("#botspeech7").text("I check...");
               $("#botspeech7").show().delay(5000).fadeOut();
               document.getElementById("bbet7").style.background = "orange";
               audio7.play();
               }
               if (player_index == 8 && players[8].subtotal_bet == 0 && checkblinds > 3)
               {
               var avatarname = "avatar" + botarray[7];
               var avatarimage = "avatar/_bot" + botarray[7] + "_call.png"
               document.getElementById(avatarname).src = avatarimage;
               $("#botspeech8").text("I check...");
               $("#botspeech8").show().delay(5000).fadeOut();
               document.getElementById("bbet8").style.background = "orange"; 
               audio7.play();
               }
               if (player_index == 9 && players[9].subtotal_bet == 0 && checkblinds > 3)
               document.getElementById("bbet9").style.background = "orange"; 
  if (checkblinds > 3)
  if (players[0].subtotal_bet > 0 || 
      players[1].subtotal_bet > 0 || 
      players[2].subtotal_bet > 0 || 
      players[3].subtotal_bet > 0 || 
      players[4].subtotal_bet > 0 || 
      players[5].subtotal_bet > 0 || 
      players[6].subtotal_bet > 0 || 
      players[7].subtotal_bet > 0 || 
      players[8].subtotal_bet > 0)
      audio8.play();               
  
  //mybankrollchips
  
        for (var x = 0; x < 20; x++)
        {
        document.getElementById("playerchipred" + x).style.display = "none";   
        document.getElementById("playerchipgreen" + x).style.display = "none"; 
        document.getElementById("playerchipblue" + x).style.display = "none"; 
        document.getElementById("playerchipblack" + x).style.display = "none";
        document.getElementById("playerchipgold" + x).style.display = "none"; 
        }
     var playerremainder;
     var playerpotposition = 0;
     var playerrandompokerchips = 0;
     var playergraphicpot = 0;
     var playerrandomleft = 220;
     var playerrandomtop = 0;
     
     playerremainder = players[0].bankroll;
     var thousands = multiplies1000(playerremainder)
     playerremainder = playerremainder - (1000 * thousands);     
     var hundreds = multiplies100(playerremainder)
     playerremainder = playerremainder - (100 * hundreds);
     var twentyfives = multiplies25(playerremainder)
     playerremainder = playerremainder - (25 * twentyfives);
     var tens = multiplies10(playerremainder)
     playerremainder = playerremainder - (10 * tens);
     var fives = multiplies5(playerremainder)
     playerremainder = playerremainder - (5 * fives);
     

        for (var reds = 0; reds < fives; reds++)
        {
        if (playerrandompokerchips < 20)
        {
        playergraphicpot = playerrandomtop + playerpotposition;
        document.getElementById("playerchipred" + playerrandompokerchips).style.marginLeft = playerrandomleft + "px";
        document.getElementById("playerchipred" + playerrandompokerchips).style.marginTop = playergraphicpot + "px";
        document.getElementById("playerchipred" + playerrandompokerchips).style.display = "block";
        document.getElementById("playerchipred" + playerrandompokerchips).style.position = "absolute";
        }
        playerrandompokerchips++; 
        playerpotposition -= 3;
        }
  
        for (var blues = 0; blues < tens; blues++)
        {
        if (playerrandompokerchips < 20)
        {
        playergraphicpot = playerrandomtop + playerpotposition;
        document.getElementById("playerchipblue" + playerrandompokerchips).style.marginLeft = playerrandomleft + "px";
        document.getElementById("playerchipblue" + playerrandompokerchips).style.marginTop = playergraphicpot + "px";
        document.getElementById("playerchipblue" + playerrandompokerchips).style.display = "block";
        document.getElementById("playerchipblue" + playerrandompokerchips).style.position = "absolute";
        }
        playerrandompokerchips++; 
        playerpotposition -= 3;
        }
   
        for (var greens = 0; greens < twentyfives; greens++)
        {
        if (playerrandompokerchips < 20)
        {
        playergraphicpot = playerrandomtop + playerpotposition;
        document.getElementById("playerchipgreen" + playerrandompokerchips).style.marginLeft = playerrandomleft + "px";
        document.getElementById("playerchipgreen" + playerrandompokerchips).style.marginTop = playergraphicpot + "px";
        document.getElementById("playerchipgreen" + playerrandompokerchips).style.display = "block";
        document.getElementById("playerchipgreen" + playerrandompokerchips).style.position = "absolute";
        }
        playerpotposition -= 3;
        playerrandompokerchips++; 
        }
        for (var blacks = 0; blacks < hundreds; blacks++)
        {
        if (playerrandompokerchips < 20)
        {
        playergraphicpot = playerrandomtop + playerpotposition;
        document.getElementById("playerchipblack" + playerrandompokerchips).style.marginLeft = playerrandomleft + "px";
        document.getElementById("playerchipblack" + playerrandompokerchips).style.marginTop = playergraphicpot + "px";
        document.getElementById("playerchipblack" + playerrandompokerchips).style.display = "block";
        document.getElementById("playerchipblack" + playerrandompokerchips).style.position = "absolute";
        }
        playerpotposition -= 3;
        playerrandompokerchips++; 
        }  
        
        for (var golds = 0; golds < thousands; golds++)
        {
        if (playerrandompokerchips < 20)
        {
        playergraphicpot = playerrandomtop + playerpotposition;
        document.getElementById("playerchipgold" + playerrandompokerchips).style.marginLeft = playerrandomleft + "px";
        document.getElementById("playerchipgold" + playerrandompokerchips).style.marginTop = playergraphicpot + "px";
        document.getElementById("playerchipgold" + playerrandompokerchips).style.display = "block";
        document.getElementById("playerchipgold" + playerrandompokerchips).style.position = "absolute";
        }
        playerpotposition -= 3;
        playerrandompokerchips++; 
        }  
        

        
        
        //                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                mybankrollchipsend
  
  
//botsbankrollchips
  
        for (var x = 0; x < 20; x++)
        {
        document.getElementById("bot1chipred" + x).style.display = "none";   
        document.getElementById("bot1chipgreen" + x).style.display = "none"; 
        document.getElementById("bot1chipblue" + x).style.display = "none"; 
        document.getElementById("bot1chipblack" + x).style.display = "none";
        document.getElementById("bot1chipgold" + x).style.display = "none"; 

        document.getElementById("bot2chipred" + x).style.display = "none";   
        document.getElementById("bot2chipgreen" + x).style.display = "none"; 
        document.getElementById("bot2chipblue" + x).style.display = "none"; 
        document.getElementById("bot2chipblack" + x).style.display = "none";
        document.getElementById("bot2chipgold" + x).style.display = "none"; 

        document.getElementById("bot3chipred" + x).style.display = "none";   
        document.getElementById("bot3chipgreen" + x).style.display = "none"; 
        document.getElementById("bot3chipblue" + x).style.display = "none"; 
        document.getElementById("bot3chipblack" + x).style.display = "none";
        document.getElementById("bot3chipgold" + x).style.display = "none";
        
       document.getElementById("bot4chipred" + x).style.display = "none";   
        document.getElementById("bot4chipgreen" + x).style.display = "none"; 
        document.getElementById("bot4chipblue" + x).style.display = "none"; 
        document.getElementById("bot4chipblack" + x).style.display = "none";
        document.getElementById("bot4chipgold" + x).style.display = "none"; 

       document.getElementById("bot5chipred" + x).style.display = "none";   
        document.getElementById("bot5chipgreen" + x).style.display = "none"; 
        document.getElementById("bot5chipblue" + x).style.display = "none"; 
        document.getElementById("bot5chipblack" + x).style.display = "none";
        document.getElementById("bot5chipgold" + x).style.display = "none"; 

       document.getElementById("bot6chipred" + x).style.display = "none";   
        document.getElementById("bot6chipgreen" + x).style.display = "none"; 
        document.getElementById("bot6chipblue" + x).style.display = "none"; 
        document.getElementById("bot6chipblack" + x).style.display = "none";
        document.getElementById("bot6chipgold" + x).style.display = "none"; 

       document.getElementById("bot7chipred" + x).style.display = "none";   
        document.getElementById("bot7chipgreen" + x).style.display = "none"; 
        document.getElementById("bot7chipblue" + x).style.display = "none"; 
        document.getElementById("bot7chipblack" + x).style.display = "none";
        document.getElementById("bot7chipgold" + x).style.display = "none"; 

       document.getElementById("bot8chipred" + x).style.display = "none";   
        document.getElementById("bot8chipgreen" + x).style.display = "none"; 
        document.getElementById("bot8chipblue" + x).style.display = "none"; 
        document.getElementById("bot8chipblack" + x).style.display = "none";
        document.getElementById("bot8chipgold" + x).style.display = "none"; 
        }

     var bot1remainder = 0;
     var bot2remainder = 0;
     var bot3remainder = 0;
     var bot4remainder = 0;
     var bot5remainder = 0;
     var bot6remainder = 0;
     var bot7remainder = 0;
     var bot8remainder = 0;
     
     var bot1potposition = 0;
     var bot2potposition = 0;
     var bot3potposition = 0;
     var bot4potposition = 0;
     var bot5potposition = 0;
     var bot6potposition = 0;
     var bot7potposition = 0;
     var bot8potposition = 0;
     
     var bot1randompokerchips = 0;
     var bot2randompokerchips = 0;
     var bot3randompokerchips = 0;
     var bot4randompokerchips = 0;
     var bot5randompokerchips = 0;
     var bot6randompokerchips = 0;
     var bot7randompokerchips = 0;
     var bot8randompokerchips = 0;
     
     var bot1graphicpot = 0;
     var bot2graphicpot = 0;
     var bot3graphicpot = 0;
     var bot4graphicpot = 0;
     var bot5graphicpot = 0;
     var bot6graphicpot = 0;
     var bot7graphicpot = 0;
     var bot8graphicpot = 0;
     
     
     var bot1randomleft = 108;
     var bot1randomtop = -20;

     var bot2randomleft = 108;
     var bot2randomtop = -20;

     var bot3randomleft = 108;
     var bot3randomtop = -20;
     
     var bot4randomleft = 108;
     var bot4randomtop = -20;
     
     var bot5randomleft = 108;
     var bot5randomtop = -20;
     
     var bot6randomleft = 108;
     var bot6randomtop = -20;
     
     var bot7randomleft = 108;
     var bot7randomtop = -20;
     
     var bot8randomleft = 108;
     var bot8randomtop = -20;
     
     bot1remainder = players[1].bankroll;
     var bot1thousands = multiplies1000(bot1remainder)
     bot1remainder = bot1remainder - (1000 * bot1thousands);     
     var bot1hundreds = multiplies100(bot1remainder)
     bot1remainder = bot1remainder - (100 * bot1hundreds);
     var bot1twentyfives = multiplies25(bot1remainder)
     bot1remainder = bot1remainder - (25 * bot1twentyfives);
     var bot1tens = multiplies10(bot1remainder)
     bot1remainder = bot1remainder - (10 * bot1tens);
     var bot1fives = multiplies5(bot1remainder)
     bot1remainder = bot1remainder - (5 * bot1fives);
     
     bot2remainder = players[2].bankroll;
     var bot2thousands = multiplies1000(bot2remainder)
     bot2remainder = bot2remainder - (1000 * bot2thousands);     
     var bot2hundreds = multiplies100(bot2remainder)
     bot2remainder = bot2remainder - (100 * bot2hundreds);
     var bot2twentyfives = multiplies25(bot2remainder)
     bot2remainder = bot2remainder - (25 * bot2twentyfives);
     var bot2tens = multiplies10(bot2remainder)
     bot2remainder = bot2remainder - (10 * bot2tens);
     var bot2fives = multiplies5(bot2remainder)
     bot2remainder = bot2remainder - (5 * bot2fives);
     
     bot3remainder = players[3].bankroll;
     var bot3thousands = multiplies1000(bot3remainder)
     bot3remainder = bot3remainder - (1000 * bot3thousands);     
     var bot3hundreds = multiplies100(bot3remainder)
     bot3remainder = bot3remainder - (100 * bot3hundreds);
     var bot3twentyfives = multiplies25(bot3remainder)
     bot3remainder = bot3remainder - (25 * bot3twentyfives);
     var bot3tens = multiplies10(bot3remainder)
     bot3remainder = bot3remainder - (10 * bot3tens);
     var bot3fives = multiplies5(bot3remainder)
     bot3remainder = bot3remainder - (5 * bot3fives);
     
     bot4remainder = players[4].bankroll;
     var bot4thousands = multiplies1000(bot4remainder)
     bot4remainder = bot4remainder - (1000 * bot4thousands);     
     var bot4hundreds = multiplies100(bot4remainder)
     bot4remainder = bot4remainder - (100 * bot4hundreds);
     var bot4twentyfives = multiplies25(bot4remainder)
     bot4remainder = bot4remainder - (25 * bot4twentyfives);
     var bot4tens = multiplies10(bot4remainder)
     bot4remainder = bot4remainder - (10 * bot4tens);
     var bot4fives = multiplies5(bot4remainder)
     bot4remainder = bot4remainder - (5 * bot4fives);
     
     bot5remainder = players[5].bankroll;
     var bot5thousands = multiplies1000(bot5remainder)
     bot5remainder = bot5remainder - (1000 * bot5thousands);     
     var bot5hundreds = multiplies100(bot5remainder)
     bot5remainder = bot5remainder - (100 * bot5hundreds);
     var bot5twentyfives = multiplies25(bot5remainder)
     bot5remainder = bot5remainder - (25 * bot5twentyfives);
     var bot5tens = multiplies10(bot5remainder)
     bot5remainder = bot5remainder - (10 * bot5tens);
     var bot5fives = multiplies5(bot5remainder)
     bot5remainder = bot5remainder - (5 * bot5fives);
     
     bot6remainder = players[6].bankroll;
     var bot6thousands = multiplies1000(bot6remainder)
     bot6remainder = bot6remainder - (1000 * bot6thousands);     
     var bot6hundreds = multiplies100(bot6remainder)
     bot6remainder = bot6remainder - (100 * bot6hundreds);
     var bot6twentyfives = multiplies25(bot6remainder)
     bot6remainder = bot6remainder - (25 * bot6twentyfives);
     var bot6tens = multiplies10(bot6remainder)
     bot6remainder = bot6remainder - (10 * bot6tens);
     var bot6fives = multiplies5(bot6remainder)
     bot6remainder = bot6remainder - (5 * bot6fives);
     
     bot7remainder = players[7].bankroll;
     var bot7thousands = multiplies1000(bot7remainder)
     bot7remainder = bot7remainder - (1000 * bot7thousands);     
     var bot7hundreds = multiplies100(bot7remainder)
     bot7remainder = bot7remainder - (100 * bot7hundreds);
     var bot7twentyfives = multiplies25(bot7remainder)
     bot7remainder = bot7remainder - (25 * bot7twentyfives);
     var bot7tens = multiplies10(bot7remainder)
     bot7remainder = bot7remainder - (10 * bot7tens);
     var bot7fives = multiplies5(bot7remainder)
     bot7remainder = bot7remainder - (5 * bot7fives);
     
     bot8remainder = players[8].bankroll;
     var bot8thousands = multiplies1000(bot8remainder)
     bot8remainder = bot8remainder - (1000 * bot8thousands);     
     var bot8hundreds = multiplies100(bot8remainder)
     bot8remainder = bot8remainder - (100 * bot8hundreds);
     var bot8twentyfives = multiplies25(bot8remainder)
     bot8remainder = bot8remainder - (25 * bot8twentyfives);
     var bot8tens = multiplies10(bot8remainder)
     bot8remainder = bot8remainder - (10 * bot8tens);
     var bot8fives = multiplies5(bot8remainder)
     bot8remainder = bot8remainder - (5 * bot8fives);
     
     
        for (var reds = 0; reds < bot1fives; reds++)
        {
        if (bot1randompokerchips < 20)
        {
        bot1graphicpot = bot1randomtop + bot1potposition;
        document.getElementById("bot1chipred" + bot1randompokerchips).style.marginLeft = bot1randomleft + "px";
        document.getElementById("bot1chipred" + bot1randompokerchips).style.marginTop = bot1graphicpot + "px";
        document.getElementById("bot1chipred" + bot1randompokerchips).style.display = "block";
        document.getElementById("bot1chipred" + bot1randompokerchips).style.position = "absolute";
        }
        bot1randompokerchips++; 
        bot1potposition -= 3;
        }
  
        for (var blues = 0; blues < bot1tens; blues++)
        {
        if (bot1randompokerchips < 20)
        {
        bot1graphicpot = bot1randomtop + bot1potposition;
        document.getElementById("bot1chipblue" + bot1randompokerchips).style.marginLeft = bot1randomleft + "px";
        document.getElementById("bot1chipblue" + bot1randompokerchips).style.marginTop = bot1graphicpot + "px";
        document.getElementById("bot1chipblue" + bot1randompokerchips).style.display = "block";
        document.getElementById("bot1chipblue" + bot1randompokerchips).style.position = "absolute";
        }
        bot1randompokerchips++; 
        bot1potposition -= 3;
        }
   
        for (var greens = 0; greens < bot1twentyfives; greens++)
        {
        if (bot1randompokerchips < 20)
        {
        bot1graphicpot = bot1randomtop + bot1potposition;
        document.getElementById("bot1chipgreen" + bot1randompokerchips).style.marginLeft = bot1randomleft + "px";
        document.getElementById("bot1chipgreen" + bot1randompokerchips).style.marginTop = bot1graphicpot + "px";
        document.getElementById("bot1chipgreen" + bot1randompokerchips).style.display = "block";
        document.getElementById("bot1chipgreen" + bot1randompokerchips).style.position = "absolute";
        }
        bot1potposition -= 3;
        bot1randompokerchips++; 
        }
        for (var blacks = 0; blacks < bot1hundreds; blacks++)
        {
        if (bot1randompokerchips < 20)
        {
        bot1graphicpot = bot1randomtop + bot1potposition;
        document.getElementById("bot1chipblack" + bot1randompokerchips).style.marginLeft = bot1randomleft + "px";
        document.getElementById("bot1chipblack" + bot1randompokerchips).style.marginTop = bot1graphicpot + "px";
        document.getElementById("bot1chipblack" + bot1randompokerchips).style.display = "block";
        document.getElementById("bot1chipblack" + bot1randompokerchips).style.position = "absolute";
        }
        bot1potposition -= 3;
        bot1randompokerchips++; 
        }  
        
        for (var golds = 0; golds < bot1thousands; golds++)
        {
        if (bot1randompokerchips < 20)
        {
        bot1graphicpot = bot1randomtop + bot1potposition;
        document.getElementById("bot1chipgold" + bot1randompokerchips).style.marginLeft = bot1randomleft + "px";
        document.getElementById("bot1chipgold" + bot1randompokerchips).style.marginTop = bot1graphicpot + "px";
        document.getElementById("bot1chipgold" + bot1randompokerchips).style.display = "block";
        document.getElementById("bot1chipgold" + bot1randompokerchips).style.position = "absolute";
        }
        bot1potposition -= 3;
        bot1randompokerchips++; 
        }  
        
        
        for (var reds = 0; reds < bot2fives; reds++)
        {
        if (bot2randompokerchips < 20)
        {
        bot2graphicpot = bot2randomtop + bot2potposition;
        document.getElementById("bot2chipred" + bot2randompokerchips).style.marginLeft = bot2randomleft + "px";
        document.getElementById("bot2chipred" + bot2randompokerchips).style.marginTop = bot2graphicpot + "px";
        document.getElementById("bot2chipred" + bot2randompokerchips).style.display = "block";
        document.getElementById("bot2chipred" + bot2randompokerchips).style.position = "absolute";
        }
        bot2randompokerchips++; 
        bot2potposition -= 3;
        }
  
        for (var blues = 0; blues < bot2tens; blues++)
        {
        if (bot2randompokerchips < 20)
        {
        bot2graphicpot = bot2randomtop + bot2potposition;
        document.getElementById("bot2chipblue" + bot2randompokerchips).style.marginLeft = bot2randomleft + "px";
        document.getElementById("bot2chipblue" + bot2randompokerchips).style.marginTop = bot2graphicpot + "px";
        document.getElementById("bot2chipblue" + bot2randompokerchips).style.display = "block";
        document.getElementById("bot2chipblue" + bot2randompokerchips).style.position = "absolute";
        }
        bot2randompokerchips++; 
        bot2potposition -= 3;
        }
   
        for (var greens = 0; greens < bot2twentyfives; greens++)
        {
        if (bot2randompokerchips < 20)
        {
        bot2graphicpot = bot2randomtop + bot2potposition;
        document.getElementById("bot2chipgreen" + bot2randompokerchips).style.marginLeft = bot2randomleft + "px";
        document.getElementById("bot2chipgreen" + bot2randompokerchips).style.marginTop = bot2graphicpot + "px";
        document.getElementById("bot2chipgreen" + bot2randompokerchips).style.display = "block";
        document.getElementById("bot2chipgreen" + bot2randompokerchips).style.position = "absolute";
        }
        bot2potposition -= 3;
        bot2randompokerchips++; 
        }
        for (var blacks = 0; blacks < bot2hundreds; blacks++)
        {
        if (bot2randompokerchips < 20)
        {
        bot2graphicpot = bot2randomtop + bot2potposition;
        document.getElementById("bot2chipblack" + bot2randompokerchips).style.marginLeft = bot2randomleft + "px";
        document.getElementById("bot2chipblack" + bot2randompokerchips).style.marginTop = bot2graphicpot + "px";
        document.getElementById("bot2chipblack" + bot2randompokerchips).style.display = "block";
        document.getElementById("bot2chipblack" + bot2randompokerchips).style.position = "absolute";
        }
        bot2potposition -= 3;
        bot2randompokerchips++; 
        }  
        
        for (var golds = 0; golds < bot2thousands; golds++)
        {
        if (bot2randompokerchips < 20)
        {
        bot2graphicpot = bot2randomtop + bot2potposition;
        document.getElementById("bot2chipgold" + bot2randompokerchips).style.marginLeft = bot2randomleft + "px";
        document.getElementById("bot2chipgold" + bot2randompokerchips).style.marginTop = bot2graphicpot + "px";
        document.getElementById("bot2chipgold" + bot2randompokerchips).style.display = "block";
        document.getElementById("bot2chipgold" + bot2randompokerchips).style.position = "absolute";
        }
        bot2potposition -= 3;
        bot2randompokerchips++; 
        }  
 
 
        for (var reds = 0; reds < bot3fives; reds++)
        {
        if (bot3randompokerchips < 20)
        {
        bot3graphicpot = bot3randomtop + bot3potposition;
        document.getElementById("bot3chipred" + bot3randompokerchips).style.marginLeft = bot3randomleft + "px";
        document.getElementById("bot3chipred" + bot3randompokerchips).style.marginTop = bot3graphicpot + "px";
        document.getElementById("bot3chipred" + bot3randompokerchips).style.display = "block";
        document.getElementById("bot3chipred" + bot3randompokerchips).style.position = "absolute";
        }
        bot3randompokerchips++; 
        bot3potposition -= 3;
        }
  
        for (var blues = 0; blues < bot3tens; blues++)
        {
        if (bot3randompokerchips < 20)
        {
        bot3graphicpot = bot3randomtop + bot3potposition;
        document.getElementById("bot3chipblue" + bot3randompokerchips).style.marginLeft = bot3randomleft + "px";
        document.getElementById("bot3chipblue" + bot3randompokerchips).style.marginTop = bot3graphicpot + "px";
        document.getElementById("bot3chipblue" + bot3randompokerchips).style.display = "block";
        document.getElementById("bot3chipblue" + bot3randompokerchips).style.position = "absolute";
        }
        bot3randompokerchips++; 
        bot3potposition -= 3;
        }
   
        for (var greens = 0; greens < bot3twentyfives; greens++)
        {
        if (bot3randompokerchips < 20)
        {
        bot3graphicpot = bot3randomtop + bot3potposition;
        document.getElementById("bot3chipgreen" + bot3randompokerchips).style.marginLeft = bot3randomleft + "px";
        document.getElementById("bot3chipgreen" + bot3randompokerchips).style.marginTop = bot3graphicpot + "px";
        document.getElementById("bot3chipgreen" + bot3randompokerchips).style.display = "block";
        document.getElementById("bot3chipgreen" + bot3randompokerchips).style.position = "absolute";
        }
        bot3potposition -= 3;
        bot3randompokerchips++; 
        }
        for (var blacks = 0; blacks < bot3hundreds; blacks++)
        {
        if (bot3randompokerchips < 20)
        {
        bot3graphicpot = bot3randomtop + bot3potposition;
        document.getElementById("bot3chipblack" + bot3randompokerchips).style.marginLeft = bot3randomleft + "px";
        document.getElementById("bot3chipblack" + bot3randompokerchips).style.marginTop = bot3graphicpot + "px";
        document.getElementById("bot3chipblack" + bot3randompokerchips).style.display = "block";
        document.getElementById("bot3chipblack" + bot3randompokerchips).style.position = "absolute";
        }
        bot3potposition -= 3;
        bot3randompokerchips++; 
        }  
        
        for (var golds = 0; golds < bot3thousands; golds++)
        {
        if (bot3randompokerchips < 20)
        {
        bot3graphicpot = bot3randomtop + bot3potposition;
        document.getElementById("bot3chipgold" + bot3randompokerchips).style.marginLeft = bot3randomleft + "px";
        document.getElementById("bot3chipgold" + bot3randompokerchips).style.marginTop = bot3graphicpot + "px";
        document.getElementById("bot3chipgold" + bot3randompokerchips).style.display = "block";
        document.getElementById("bot3chipgold" + bot3randompokerchips).style.position = "absolute";
        }
        bot3potposition -= 3;
        bot3randompokerchips++; 
        }  
 
        for (var reds = 0; reds < bot4fives; reds++)
        {
        if (bot4randompokerchips < 20)
        {
        bot4graphicpot = bot4randomtop + bot4potposition;
        document.getElementById("bot4chipred" + bot4randompokerchips).style.marginLeft = bot4randomleft + "px";
        document.getElementById("bot4chipred" + bot4randompokerchips).style.marginTop = bot4graphicpot + "px";
        document.getElementById("bot4chipred" + bot4randompokerchips).style.display = "block";
        document.getElementById("bot4chipred" + bot4randompokerchips).style.position = "absolute";
        }
        bot4randompokerchips++; 
        bot4potposition -= 3;
        }
  
        for (var blues = 0; blues < bot4tens; blues++)
        {
        if (bot4randompokerchips < 20)
        {
        bot4graphicpot = bot4randomtop + bot4potposition;
        document.getElementById("bot4chipblue" + bot4randompokerchips).style.marginLeft = bot4randomleft + "px";
        document.getElementById("bot4chipblue" + bot4randompokerchips).style.marginTop = bot4graphicpot + "px";
        document.getElementById("bot4chipblue" + bot4randompokerchips).style.display = "block";
        document.getElementById("bot4chipblue" + bot4randompokerchips).style.position = "absolute";
        }
        bot4randompokerchips++; 
        bot4potposition -= 3;
        }
   
        for (var greens = 0; greens < bot4twentyfives; greens++)
        {
        if (bot4randompokerchips < 20)
        {
        bot4graphicpot = bot4randomtop + bot4potposition;
        document.getElementById("bot4chipgreen" + bot4randompokerchips).style.marginLeft = bot4randomleft + "px";
        document.getElementById("bot4chipgreen" + bot4randompokerchips).style.marginTop = bot4graphicpot + "px";
        document.getElementById("bot4chipgreen" + bot4randompokerchips).style.display = "block";
        document.getElementById("bot4chipgreen" + bot4randompokerchips).style.position = "absolute";
        }
        bot4potposition -= 3;
        bot4randompokerchips++; 
        }
        for (var blacks = 0; blacks < bot4hundreds; blacks++)
        {
        if (bot4randompokerchips < 20)
        {
        bot4graphicpot = bot4randomtop + bot4potposition;
        document.getElementById("bot4chipblack" + bot4randompokerchips).style.marginLeft = bot4randomleft + "px";
        document.getElementById("bot4chipblack" + bot4randompokerchips).style.marginTop = bot4graphicpot + "px";
        document.getElementById("bot4chipblack" + bot4randompokerchips).style.display = "block";
        document.getElementById("bot4chipblack" + bot4randompokerchips).style.position = "absolute";
        }
        bot4potposition -= 3;
        bot4randompokerchips++; 
        }  
        
        for (var golds = 0; golds < bot4thousands; golds++)
        {
        if (bot4randompokerchips < 20)
        {
        bot4graphicpot = bot4randomtop + bot4potposition;
        document.getElementById("bot4chipgold" + bot4randompokerchips).style.marginLeft = bot4randomleft + "px";
        document.getElementById("bot4chipgold" + bot4randompokerchips).style.marginTop = bot4graphicpot + "px";
        document.getElementById("bot4chipgold" + bot4randompokerchips).style.display = "block";
        document.getElementById("bot4chipgold" + bot4randompokerchips).style.position = "absolute";
        }
        bot4potposition -= 3;
        bot4randompokerchips++; 
        }  
 
        for (var reds = 0; reds < bot5fives; reds++)
        {
        if (bot5randompokerchips < 20)
        {
        bot5graphicpot = bot5randomtop + bot5potposition;
        document.getElementById("bot5chipred" + bot5randompokerchips).style.marginLeft = bot5randomleft + "px";
        document.getElementById("bot5chipred" + bot5randompokerchips).style.marginTop = bot5graphicpot + "px";
        document.getElementById("bot5chipred" + bot5randompokerchips).style.display = "block";
        document.getElementById("bot5chipred" + bot5randompokerchips).style.position = "absolute";
        }
        bot5randompokerchips++; 
        bot5potposition -= 3;
        }
  
        for (var blues = 0; blues < bot5tens; blues++)
        {
        if (bot5randompokerchips < 20)
        {
        bot5graphicpot = bot5randomtop + bot5potposition;
        document.getElementById("bot5chipblue" + bot5randompokerchips).style.marginLeft = bot5randomleft + "px";
        document.getElementById("bot5chipblue" + bot5randompokerchips).style.marginTop = bot5graphicpot + "px";
        document.getElementById("bot5chipblue" + bot5randompokerchips).style.display = "block";
        document.getElementById("bot5chipblue" + bot5randompokerchips).style.position = "absolute";
        }
        bot5randompokerchips++; 
        bot5potposition -= 3;
        }
   
        for (var greens = 0; greens < bot5twentyfives; greens++)
        {
        if (bot5randompokerchips < 20)
        {
        bot5graphicpot = bot5randomtop + bot5potposition;
        document.getElementById("bot5chipgreen" + bot5randompokerchips).style.marginLeft = bot5randomleft + "px";
        document.getElementById("bot5chipgreen" + bot5randompokerchips).style.marginTop = bot5graphicpot + "px";
        document.getElementById("bot5chipgreen" + bot5randompokerchips).style.display = "block";
        document.getElementById("bot5chipgreen" + bot5randompokerchips).style.position = "absolute";
        }
        bot5potposition -= 3;
        bot5randompokerchips++; 
        }
        for (var blacks = 0; blacks < bot5hundreds; blacks++)
        {
        if (bot5randompokerchips < 20)
        {
        bot5graphicpot = bot5randomtop + bot5potposition;
        document.getElementById("bot5chipblack" + bot5randompokerchips).style.marginLeft = bot5randomleft + "px";
        document.getElementById("bot5chipblack" + bot5randompokerchips).style.marginTop = bot5graphicpot + "px";
        document.getElementById("bot5chipblack" + bot5randompokerchips).style.display = "block";
        document.getElementById("bot5chipblack" + bot5randompokerchips).style.position = "absolute";
        }
        bot5potposition -= 3;
        bot5randompokerchips++; 
        }  
        
        for (var golds = 0; golds < bot5thousands; golds++)
        {
        if (bot5randompokerchips < 20)
        {
        bot5graphicpot = bot5randomtop + bot5potposition;
        document.getElementById("bot5chipgold" + bot5randompokerchips).style.marginLeft = bot5randomleft + "px";
        document.getElementById("bot5chipgold" + bot5randompokerchips).style.marginTop = bot5graphicpot + "px";
        document.getElementById("bot5chipgold" + bot5randompokerchips).style.display = "block";
        document.getElementById("bot5chipgold" + bot5randompokerchips).style.position = "absolute";
        }
        bot5potposition -= 3;
        bot5randompokerchips++; 
        }  
 
        for (var reds = 0; reds < bot6fives; reds++)
        {
        if (bot6randompokerchips < 20)
        {
        bot6graphicpot = bot6randomtop + bot6potposition;
        document.getElementById("bot6chipred" + bot6randompokerchips).style.marginLeft = bot6randomleft + "px";
        document.getElementById("bot6chipred" + bot6randompokerchips).style.marginTop = bot6graphicpot + "px";
        document.getElementById("bot6chipred" + bot6randompokerchips).style.display = "block";
        document.getElementById("bot6chipred" + bot6randompokerchips).style.position = "absolute";
        }
        bot6randompokerchips++; 
        bot6potposition -= 3;
        }
  
        for (var blues = 0; blues < bot6tens; blues++)
        {
        if (bot6randompokerchips < 20)
        {
        bot6graphicpot = bot6randomtop + bot6potposition;
        document.getElementById("bot6chipblue" + bot6randompokerchips).style.marginLeft = bot6randomleft + "px";
        document.getElementById("bot6chipblue" + bot6randompokerchips).style.marginTop = bot6graphicpot + "px";
        document.getElementById("bot6chipblue" + bot6randompokerchips).style.display = "block";
        document.getElementById("bot6chipblue" + bot6randompokerchips).style.position = "absolute";
        }
        bot6randompokerchips++; 
        bot6potposition -= 3;
        }
   
        for (var greens = 0; greens < bot6twentyfives; greens++)
        {
        if (bot6randompokerchips < 20)
        {
        bot6graphicpot = bot6randomtop + bot6potposition;
        document.getElementById("bot6chipgreen" + bot6randompokerchips).style.marginLeft = bot6randomleft + "px";
        document.getElementById("bot6chipgreen" + bot6randompokerchips).style.marginTop = bot6graphicpot + "px";
        document.getElementById("bot6chipgreen" + bot6randompokerchips).style.display = "block";
        document.getElementById("bot6chipgreen" + bot6randompokerchips).style.position = "absolute";
        }
        bot6potposition -= 3;
        bot6randompokerchips++; 
        }
        for (var blacks = 0; blacks < bot6hundreds; blacks++)
        {
        if (bot6randompokerchips < 20)
        {
        bot6graphicpot = bot6randomtop + bot6potposition;
        document.getElementById("bot6chipblack" + bot6randompokerchips).style.marginLeft = bot6randomleft + "px";
        document.getElementById("bot6chipblack" + bot6randompokerchips).style.marginTop = bot6graphicpot + "px";
        document.getElementById("bot6chipblack" + bot6randompokerchips).style.display = "block";
        document.getElementById("bot6chipblack" + bot6randompokerchips).style.position = "absolute";
        }
        bot6potposition -= 3;
        bot6randompokerchips++; 
        }  
        
        for (var golds = 0; golds < bot6thousands; golds++)
        {
        if (bot6randompokerchips < 20)
        {
        bot6graphicpot = bot6randomtop + bot6potposition;
        document.getElementById("bot6chipgold" + bot6randompokerchips).style.marginLeft = bot6randomleft + "px";
        document.getElementById("bot6chipgold" + bot6randompokerchips).style.marginTop = bot6graphicpot + "px";
        document.getElementById("bot6chipgold" + bot6randompokerchips).style.display = "block";
        document.getElementById("bot6chipgold" + bot6randompokerchips).style.position = "absolute";
        }
        bot6potposition -= 3;
        bot6randompokerchips++; 
        }  
 
        for (var reds = 0; reds < bot7fives; reds++)
        {
        if (bot7randompokerchips < 20)
        {
        bot7graphicpot = bot7randomtop + bot7potposition;
        document.getElementById("bot7chipred" + bot7randompokerchips).style.marginLeft = bot7randomleft + "px";
        document.getElementById("bot7chipred" + bot7randompokerchips).style.marginTop = bot7graphicpot + "px";
        document.getElementById("bot7chipred" + bot7randompokerchips).style.display = "block";
        document.getElementById("bot7chipred" + bot7randompokerchips).style.position = "absolute";
        }
        bot7randompokerchips++; 
        bot7potposition -= 3;
        }
  
        for (var blues = 0; blues < bot7tens; blues++)
        {
        if (bot7randompokerchips < 20)
        {
        bot7graphicpot = bot7randomtop + bot7potposition;
        document.getElementById("bot7chipblue" + bot7randompokerchips).style.marginLeft = bot7randomleft + "px";
        document.getElementById("bot7chipblue" + bot7randompokerchips).style.marginTop = bot7graphicpot + "px";
        document.getElementById("bot7chipblue" + bot7randompokerchips).style.display = "block";
        document.getElementById("bot7chipblue" + bot7randompokerchips).style.position = "absolute";
        }
        bot7randompokerchips++; 
        bot7potposition -= 3;
        }
   
        for (var greens = 0; greens < bot7twentyfives; greens++)
        {
        if (bot7randompokerchips < 20)
        {
        bot7graphicpot = bot7randomtop + bot7potposition;
        document.getElementById("bot7chipgreen" + bot7randompokerchips).style.marginLeft = bot7randomleft + "px";
        document.getElementById("bot7chipgreen" + bot7randompokerchips).style.marginTop = bot7graphicpot + "px";
        document.getElementById("bot7chipgreen" + bot7randompokerchips).style.display = "block";
        document.getElementById("bot7chipgreen" + bot7randompokerchips).style.position = "absolute";
        }
        bot7potposition -= 3;
        bot7randompokerchips++; 
        }
        for (var blacks = 0; blacks < bot7hundreds; blacks++)
        {
        if (bot7randompokerchips < 20)
        {
        bot7graphicpot = bot7randomtop + bot7potposition;
        document.getElementById("bot7chipblack" + bot7randompokerchips).style.marginLeft = bot7randomleft + "px";
        document.getElementById("bot7chipblack" + bot7randompokerchips).style.marginTop = bot7graphicpot + "px";
        document.getElementById("bot7chipblack" + bot7randompokerchips).style.display = "block";
        document.getElementById("bot7chipblack" + bot7randompokerchips).style.position = "absolute";
        }
        bot7potposition -= 3;
        bot7randompokerchips++; 
        }  
        
        for (var golds = 0; golds < bot7thousands; golds++)
        {
        if (bot7randompokerchips < 20)
        {
        bot7graphicpot = bot7randomtop + bot7potposition;
        document.getElementById("bot7chipgold" + bot7randompokerchips).style.marginLeft = bot7randomleft + "px";
        document.getElementById("bot7chipgold" + bot7randompokerchips).style.marginTop = bot7graphicpot + "px";
        document.getElementById("bot7chipgold" + bot7randompokerchips).style.display = "block";
        document.getElementById("bot7chipgold" + bot7randompokerchips).style.position = "absolute";
        }
        bot7potposition -= 3;
        bot7randompokerchips++; 
        }  
 
        for (var reds = 0; reds < bot8fives; reds++)
        {
        if (bot8randompokerchips < 20)
        {
        bot8graphicpot = bot8randomtop + bot8potposition;
        document.getElementById("bot8chipred" + bot8randompokerchips).style.marginLeft = bot8randomleft + "px";
        document.getElementById("bot8chipred" + bot8randompokerchips).style.marginTop = bot8graphicpot + "px";
        document.getElementById("bot8chipred" + bot8randompokerchips).style.display = "block";
        document.getElementById("bot8chipred" + bot8randompokerchips).style.position = "absolute";
        }
        bot8randompokerchips++; 
        bot8potposition -= 3;
        }
  
        for (var blues = 0; blues < bot8tens; blues++)
        {
        if (bot8randompokerchips < 20)
        {
        bot8graphicpot = bot8randomtop + bot8potposition;
        document.getElementById("bot8chipblue" + bot8randompokerchips).style.marginLeft = bot8randomleft + "px";
        document.getElementById("bot8chipblue" + bot8randompokerchips).style.marginTop = bot8graphicpot + "px";
        document.getElementById("bot8chipblue" + bot8randompokerchips).style.display = "block";
        document.getElementById("bot8chipblue" + bot8randompokerchips).style.position = "absolute";
        }
        bot8randompokerchips++; 
        bot8potposition -= 3;
        }
   
        for (var greens = 0; greens < bot8twentyfives; greens++)
        {
        if (bot8randompokerchips < 20)
        {
        bot8graphicpot = bot8randomtop + bot8potposition;
        document.getElementById("bot8chipgreen" + bot8randompokerchips).style.marginLeft = bot8randomleft + "px";
        document.getElementById("bot8chipgreen" + bot8randompokerchips).style.marginTop = bot8graphicpot + "px";
        document.getElementById("bot8chipgreen" + bot8randompokerchips).style.display = "block";
        document.getElementById("bot8chipgreen" + bot8randompokerchips).style.position = "absolute";
        }
        bot8potposition -= 3;
        bot8randompokerchips++; 
        }
        for (var blacks = 0; blacks < bot8hundreds; blacks++)
        {
        if (bot8randompokerchips < 20)
        {
        bot8graphicpot = bot8randomtop + bot8potposition;
        document.getElementById("bot8chipblack" + bot8randompokerchips).style.marginLeft = bot8randomleft + "px";
        document.getElementById("bot8chipblack" + bot8randompokerchips).style.marginTop = bot8graphicpot + "px";
        document.getElementById("bot8chipblack" + bot8randompokerchips).style.display = "block";
        document.getElementById("bot8chipblack" + bot8randompokerchips).style.position = "absolute";
        }
        bot8potposition -= 3;
        bot8randompokerchips++; 
        }  
        
        for (var golds = 0; golds < bot8thousands; golds++)
        {
        if (bot8randompokerchips < 20)
        {
        bot8graphicpot = bot8randomtop + bot8potposition;
        document.getElementById("bot8chipgold" + bot8randompokerchips).style.marginLeft = bot8randomleft + "px";
        document.getElementById("bot8chipgold" + bot8randompokerchips).style.marginTop = bot8graphicpot + "px";
        document.getElementById("bot8chipgold" + bot8randompokerchips).style.display = "block";
        document.getElementById("bot8chipgold" + bot8randompokerchips).style.position = "absolute";
        }
        bot8potposition -= 3;
        bot8randompokerchips++; 
        }  
 
        
        //   botsmybankrollchipsend                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                             
  
  var current_pot_size = get_pot_size();
  gui_write_basic_general(current_pot_size);
  return 1;
}

function human_call () {
  // Clear buttons
  gui_hide_fold_call_click();
  players[0].status = "CALL";
  current_bettor_index = get_next_player_position(0, 1);
  the_bet_function(0, current_bet_amount - players[0].subtotal_bet);
  write_player(0, 0, 0);
  main();
}

function handle_human_bet (bet_amount) {
  if (bet_amount < 0 || isNaN(bet_amount)) bet_amount = 0;
  var to_call = current_bet_amount - players[0].subtotal_bet;
  bet_amount += to_call;
  var is_ok_bet = the_bet_function(0, bet_amount);
  if (is_ok_bet) {
    players[0].status = "CALL";
    current_bettor_index = get_next_player_position(0, 1);
    write_player(0, 0, 0);
    main();
    gui_hide_guick_raise();
  } else {
    crash_me();
  }
}

function human_fold () {
  players[0].status = "FOLD";
  // Clear the buttons - not able to call
  gui_hide_fold_call_click();
  current_bettor_index = get_next_player_position(0, 1);
  write_player(0, 0, 0);
  var current_pot_size = get_pot_size();
  gui_write_basic_general(current_pot_size);
  main();
}

function bet_from_bot (x) {
  var b = 0;
  var n = current_bet_amount - players[x].subtotal_bet;
  if (!board[0]) b = bot_get_preflop_bet();
  else b = bot_get_postflop_bet();
  if (b >= players[x].bankroll) { // ALL IN
    players[x].status = "";
  } else if (b < n) { // BET 2 SMALL
    b = 0;
    players[x].status = "FOLD";
               if (x == 0)
               {
               document.getElementById("mybet").style.background = "black";
               }
               if (x == 1)
               {
               
               document.getElementById("bbet1").style.background = "black";
               var avatarname = "avatar" + botarray[0];
               var avatarimage = "avatar/_bot" + botarray[0] + "_normal.png"
               document.getElementById(avatarname).src = avatarimage;
               
               $("#botspeech1").text("I fold...");
               $("#botspeech1").show().delay(5000).fadeOut();
               }
               if (x == 2)
               {
               $("#botspeech2").text("I fold...");
               $("#botspeech2").show().delay(5000).fadeOut();
               var avatarname = "avatar" + botarray[1];
               var avatarimage = "avatar/_bot" + botarray[1] + "_normal.png"
               document.getElementById(avatarname).src = avatarimage;
               document.getElementById("bbet2").style.background = "black";
               }
               if (x == 3)
               {
               $("#botspeech3").text("I fold...");
               $("#botspeech3").show().delay(5000).fadeOut();
               var avatarname = "avatar" + botarray[2];
               var avatarimage = "avatar/_bot" + botarray[2] + "_normal.png"
               document.getElementById(avatarname).src = avatarimage;
               document.getElementById("bbet3").style.background = "black";
               }
               if (x == 4)
               {
               $("#botspeech4").text("I fold...");
               $("#botspeech4").show().delay(5000).fadeOut();
               var avatarname = "avatar" + botarray[3];
               var avatarimage = "avatar/_bot" + botarray[3] + "_normal.png"
               document.getElementById(avatarname).src = avatarimage;
               document.getElementById("bbet4").style.background = "black";
               }
               if (x == 5)
               {
               $("#botspeech5").text("I fold...");
               var avatarname = "avatar" + botarray[4];
               var avatarimage = "avatar/_bot" + botarray[4] + "_normal.png"
               document.getElementById(avatarname).src = avatarimage;
               $("#botspeech5").show().delay(5000).fadeOut();
               document.getElementById("bbet5").style.background = "black";
               }
               if (x == 6)
               {
               $("#botspeech6").text("I fold...");
               var avatarname = "avatar" + botarray[5];
               var avatarimage = "avatar/_bot" + botarray[5] + "_normal.png"
               document.getElementById(avatarname).src = avatarimage;
               $("#botspeech6").show().delay(5000).fadeOut();
               document.getElementById("bbet6").style.background = "black";
               }
               if (x == 7)
               {
               $("#botspeech7").text("I fold...");
               var avatarname = "avatar" + botarray[6];
               var avatarimage = "avatar/_bot" + botarray[6] + "_normal.png"
               document.getElementById(avatarname).src = avatarimage;
               $("#botspeech7").show().delay(5000).fadeOut();
               document.getElementById("bbet7").style.background = "black";
               }
               if (x == 8)
               {
               $("#botspeech8").text("I fold...");
               $("#botspeech8").show().delay(5000).fadeOut();
               var avatarname = "avatar" + botarray[7];
               var avatarimage = "avatar/_bot" + botarray[7] + "_normal.png"
               document.getElementById(avatarname).src = avatarimage;
               document.getElementById("bbet8").style.background = "black";
               } 
               if (x == 9)
               document.getElementById("bbet9").style.background = "black";
  } else if (b == n) { // CALL
    players[x].status = "CALL";
               if (x == 0)
               {
                
               document.getElementById("mybet").style.background = "lawngreen";
               }
               if (x == 1)
               {
         
               var avatarname = "avatar" + botarray[0];
               var avatarimage = "avatar/_bot" + botarray[0] + "_call.png"
               document.getElementById(avatarname).src = avatarimage;
               $("#botspeech1").text("I call...");
               $("#botspeech1").show().delay(5000).fadeOut();
               document.getElementById("bbet1").style.background = "lawngreen";
               }
               if (x == 2)
               {
               $("#botspeech2").text("I call...");
               
               var avatarname = "avatar" + botarray[1];
               var avatarimage = "avatar/_bot" + botarray[1] + "_call.png"
               document.getElementById(avatarname).src = avatarimage;
               $("#botspeech2").show().delay(5000).fadeOut();
               document.getElementById("bbet2").style.background = "lawngreen";
               }
               if (x == 3)
               {
               $("#botspeech3").text("I call...");
               var avatarname = "avatar" + botarray[2];
               var avatarimage = "avatar/_bot" + botarray[2] + "_call.png"
               document.getElementById(avatarname).src = avatarimage;
               $("#botspeech3").show().delay(5000).fadeOut();
               document.getElementById("bbet3").style.background = "lawngreen";
               }
               if (x == 4)
               {
               $("#botspeech4").text("I call...");
               $("#botspeech4").show().delay(5000).fadeOut();
               var avatarname = "avatar" + botarray[3];
               var avatarimage = "avatar/_bot" + botarray[3] + "_call.png"
               document.getElementById(avatarname).src = avatarimage;
               document.getElementById("bbet4").style.background = "lawngreen";
               }
               if (x == 5)
               {
               $("#botspeech5").text("I call...");
               var avatarname = "avatar" + botarray[4];
               var avatarimage = "avatar/_bot" + botarray[4] + "_call.png"
               document.getElementById(avatarname).src = avatarimage;
               $("#botspeech5").show().delay(5000).fadeOut();
               document.getElementById("bbet5").style.background = "lawngreen";
               }
               if (x == 6)
               {
               $("#botspeech6").text("I call...");
               var avatarname = "avatar" + botarray[5];
               var avatarimage = "avatar/_bot" + botarray[5] + "_call.png"
               document.getElementById(avatarname).src = avatarimage;
               $("#botspeech6").show().delay(5000).fadeOut();
               document.getElementById("bbet6").style.background = "lawngreen";
               }
               if (x == 7)
               {
               $("#botspeech7").text("I call...");
               var avatarname = "avatar" + botarray[6];
               var avatarimage = "avatar/_bot" + botarray[6] + "_call.png"
               document.getElementById(avatarname).src = avatarimage;
               $("#botspeech7").show().delay(5000).fadeOut();
               document.getElementById("bbet7").style.background = "lawngreen";
               }
               if (x == 8)
               {
               $("#botspeech8").text("I call...");
               var avatarname = "avatar" + botarray[7];
               var avatarimage = "avatar/_bot" + botarray[7] + "_call.png"
               document.getElementById(avatarname).src = avatarimage;
               $("#botspeech8").show().delay(5000).fadeOut();
               document.getElementById("bbet8").style.background = "lawngreen"; 
               }
               if (x == 9)
               document.getElementById("bbet9").style.background = "lawngreen";
  } else if (b > n) {
    if (b - n < current_min_raise) { // RAISE 2 SMALL
      b = n;
      players[x].status = "CALL";
                if (x == 0)
               {
                
               document.getElementById("mybet").style.background = "lawngreen";
               }
               if (x == 1)
               {
               $("#botspeech1").text("I call...");
               var avatarname = "avatar" + botarray[0];
               var avatarimage = "avatar/_bot" + botarray[0] + "_call.png"
               document.getElementById(avatarname).src = avatarimage;
               $("#botspeech1").show().delay(5000).fadeOut();
               document.getElementById("bbet1").style.background = "lawngreen";
               }
               if (x == 2)
               {
               $("#botspeech2").text("I call...");
               
               var avatarname = "avatar" + botarray[1];
               var avatarimage = "avatar/_bot" + botarray[1] + "_call.png"
               document.getElementById(avatarname).src = avatarimage;
               $("#botspeech2").show().delay(5000).fadeOut();
               document.getElementById("bbet2").style.background = "lawngreen";
               }
               if (x == 3)
               {
               $("#botspeech3").text("I call...");
                var avatarname = "avatar" + botarray[2];
               var avatarimage = "avatar/_bot" + botarray[2] + "_call.png"
               document.getElementById(avatarname).src = avatarimage;
               $("#botspeech3").show().delay(5000).fadeOut();
               document.getElementById("bbet3").style.background = "lawngreen";
               }
               if (x == 4)
               {
               $("#botspeech4").text("I call...");
               $("#botspeech4").show().delay(5000).fadeOut();
               var avatarname = "avatar" + botarray[3];
               var avatarimage = "avatar/_bot" + botarray[3] + "_call.png"
               document.getElementById(avatarname).src = avatarimage;
               document.getElementById("bbet4").style.background = "lawngreen";
               }
               if (x == 5)
               {
               $("#botspeech5").text("I call...");
                 var avatarname = "avatar" + botarray[4];
               var avatarimage = "avatar/_bot" + botarray[4] + "_call.png"
               document.getElementById(avatarname).src = avatarimage;
               $("#botspeech5").show().delay(5000).fadeOut();
               document.getElementById("bbet5").style.background = "lawngreen";
               }
               if (x == 6)
               {
               $("#botspeech6").text("I call...");
               var avatarname = "avatar" + botarray[5];
               var avatarimage = "avatar/_bot" + botarray[5] + "_call.png"
               document.getElementById(avatarname).src = avatarimage;
               $("#botspeech6").show().delay(5000).fadeOut();
               document.getElementById("bbet6").style.background = "lawngreen";
               }
               if (x == 7)
               {
               $("#botspeech7").text("I call...");
               var avatarname = "avatar" + botarray[6];
               var avatarimage = "avatar/_bot" + botarray[6] + "_call.png"
               document.getElementById(avatarname).src = avatarimage;
               $("#botspeech7").show().delay(5000).fadeOut();
               document.getElementById("bbet7").style.background = "lawngreen";
               }
               if (x == 8)
               {
               $("#botspeech8").text("I call...");
               var avatarname = "avatar" + botarray[7];
               var avatarimage = "avatar/_bot" + botarray[7] + "_call.png"
               document.getElementById(avatarname).src = avatarimage;
               $("#botspeech8").show().delay(5000).fadeOut();
               document.getElementById("bbet8").style.background = "lawngreen"; 
               }
               if (x == 9)
               document.getElementById("bbet9").style.background = "lawngreen";
    } else {
      players[x].status = ""; // RAISE
         audio4.play();
               if (x == 0)
               {
                
               document.getElementById("mybet").style.background = "lawngreen";
               }
               if (x == 1)
               {
               var avatarname = "avatar" + botarray[0];
               var avatarimage = "avatar/_bot" + botarray[0] + "_call.png"
               document.getElementById(avatarname).src = avatarimage;
               $("#botspeech1").text("I raise...");
               $("#botspeech1").show().delay(5000).fadeOut();
               document.getElementById("bbet1").style.background = "lawngreen";
               }
               if (x == 2)
               {
               var avatarname = "avatar" + botarray[1];
               var avatarimage = "avatar/_bot" + botarray[1] + "_call.png"
               document.getElementById(avatarname).src = avatarimage;
               $("#botspeech2").text("I raise...");
               $("#botspeech2").show().delay(5000).fadeOut();
               document.getElementById("bbet2").style.background = "lawngreen";
               }
               if (x == 3)
               {
               var avatarname = "avatar" + botarray[2];
               var avatarimage = "avatar/_bot" + botarray[2] + "_call.png"
               document.getElementById(avatarname).src = avatarimage;
               $("#botspeech3").text("I raise...");
               $("#botspeech3").show().delay(5000).fadeOut();
               document.getElementById("bbet3").style.background = "lawngreen";
               }
               if (x == 4)
               {
               var avatarname = "avatar" + botarray[3];
               var avatarimage = "avatar/_bot" + botarray[3] + "_call.png"
               document.getElementById(avatarname).src = avatarimage;
               $("#botspeech4").text("I raise...");
               $("#botspeech4").show().delay(5000).fadeOut();
               document.getElementById("bbet4").style.background = "lawngreen";
               }
               if (x == 5)
               {
               var avatarname = "avatar" + botarray[4];
               var avatarimage = "avatar/_bot" + botarray[4] + "_call.png"
               document.getElementById(avatarname).src = avatarimage;
               $("#botspeech5").text("I raise...");
               $("#botspeech5").show().delay(5000).fadeOut();
               document.getElementById("bbet5").style.background = "lawngreen";
               }
               if (x == 6)
               {
               document.getElementById("avatar6").src = "avatar/_bot6_call.png";
               var avatarname = "avatar" + botarray[5];
               var avatarimage = "avatar/_bot" + botarray[5] + "_call.png"
               document.getElementById(avatarname).src = avatarimage;
               $("#botspeech6").text("I raise...");
               $("#botspeech6").show().delay(5000).fadeOut();
               document.getElementById("bbet6").style.background = "lawngreen";
               }
               if (x == 7)
               {
               var avatarname = "avatar" + botarray[6];
               var avatarimage = "avatar/_bot" + botarray[6] + "_call.png"
               document.getElementById(avatarname).src = avatarimage;
               $("#botspeech7").text("I raise...");
               $("#botspeech7").show().delay(5000).fadeOut();
               document.getElementById("bbet7").style.background = "lawngreen";
               }
               if (x == 8)
               {
               var avatarname = "avatar" + botarray[7];
               var avatarimage = "avatar/_bot" + botarray[7] + "_call.png"
               document.getElementById(avatarname).src = avatarimage;
               $("#botspeech8").text("I raise...");
               $("#botspeech8").show().delay(5000).fadeOut();
               document.getElementById("bbet8").style.background = "lawngreen"; 
               }
               if (x == 9)
               document.getElementById("bbet9").style.background = "lawngreen"; 
               
               
      
               
               
               

    }
  }
  if (the_bet_function(x, b) == 0) {
    players[x].status = "FOLD";
    the_bet_function(x, 0);
  }
  write_player(current_bettor_index, 0, 0);
  current_bettor_index = get_next_player_position(current_bettor_index, 1);
  main();
}

function write_player (n, hilite, show_cards) {
  var carda = "";
  var cardb = "";
  var name_background_color = "";
  var firedup = "";
  var name_font_color = "";
  if (hilite == 1) {            // Current
    name_background_color = BG_HILITE;
    firedup = "linear-gradient(45deg, #666666, #333333)";
    name_font_color = 'black';
  } else if (hilite == 2) {       // Winner
    name_background_color = 'red';
    firedup = "url(static/images/fire.gif)";
   
  }
  if (players[n].status == "FOLD") {
    name_font_color = 'black';
    name_background_color = 'gray';
    firedup = "linear-gradient(45deg, #666666, #333333)";
  }
  if (players[n].status == "BUST") {
    name_font_color = 'white';
    name_background_color = 'black';
    firedup = "linear-gradient(45deg, #666666, #333333)";
  }
  gui_hilite_player(name_background_color, name_font_color, n, firedup);
  

  
  
  var show_folded = false;
  // If the human is out of the game
  if (players[0].status == "BUST" || players[0].status == "FOLD") {
    show_cards = 1;
  }
  if (players[n].carda) {
    if (players[n].status == "FOLD") {
      carda = "";
      show_folded = true;
    } else {
      carda = "blinded";
    }
    if (n == 0 || (show_cards && players[n].status != "FOLD")) {
      carda = players[n].carda;
    }
  }
  if (players[n].cardb) {
    if (players[n].status == "FOLD") {
      cardb = "";
      show_folded = true;
    } else {
      cardb = "blinded";
    }
    if (n == 0 || (show_cards && players[n].status != "FOLD")) {
      cardb = players[n].cardb;
    }
  }

  if (n == button_index) {
    gui_place_dealer_button(n);
    if (mydealershowonce == 0)
    {
    mycurrentdealeris = players[n].name;
    }
  }
  var bet_text = "TO BE OVERWRITTEN";
  var allin = "Bet:";

  if (players[n].status == "FOLD") {

    audio3.play();
    bet_text = "FOLDED (" +
               (players[n].subtotal_bet + players[n].total_bet) + ")";
    if (n == 0) {
      HUMAN_GOES_ALL_IN = 0;
    }
  } else if (players[n].status == "BUST") {
               if (players[1].status == "BUST")
               {
               var avatarname = "avatar" + botarray[0];
               var avatarimage = "avatar/_bot" + botarray[0] + "_normal.png";
               document.getElementById(avatarname).src = avatarimage;
               }
               if (players[2].status == "BUST")
               {
               var avatarname = "avatar" + botarray[1];
               var avatarimage = "avatar/_bot" + botarray[1] + "_normal.png";
               document.getElementById(avatarname).src = avatarimage;
               }
               if (players[3].status == "BUST")
               {
               var avatarname = "avatar" + botarray[2];
               var avatarimage = "avatar/_bot" + botarray[2] + "_normal.png";
               document.getElementById(avatarname).src = avatarimage;
               }
               if (players[4].status == "BUST")
               {
               var avatarname = "avatar" + botarray[3];
               var avatarimage = "avatar/_bot" + botarray[3] + "_normal.png";
               document.getElementById(avatarname).src = avatarimage;
               }
               if (players[5].status == "BUST")
               {
               var avatarname = "avatar" + botarray[4];
               var avatarimage = "avatar/_bot" + botarray[4] + "_normal.png";
               document.getElementById(avatarname).src = avatarimage;
               }
               if (players[6].status == "BUST")
               {
               var avatarname = "avatar" + botarray[5];
               var avatarimage = "avatar/_bot" + botarray[5] + "_normal.png";
               document.getElementById(avatarname).src = avatarimage;
               }
               if (players[7].status == "BUST")
               {
               var avatarname = "avatar" + botarray[6];
               var avatarimage = "avatar/_bot" + botarray[6] + "_normal.png";
               document.getElementById(avatarname).src = avatarimage;
               }
               if (players[8].status == "BUST")
               {
               var avatarname = "avatar" + botarray[7];
               var avatarimage = "avatar/_bot" + botarray[7] + "_normal.png";
               document.getElementById(avatarname).src = avatarimage;
               }
    bet_text = "BUSTED";
    if (n == 0) {
      HUMAN_GOES_ALL_IN = 0;
    }
  } else if (!has_money(n)) {
        
   // audio2.play();
    bet_text = "ALL IN (" +

               (players[n].subtotal_bet + players[n].total_bet) + ")";
               if (n == 0)
               document.getElementById("mybet").style.background = "red";
               if (n == 1)
               {
               var avatarname = "avatar" + botarray[0];
               var avatarimage = "avatar/_bot" + botarray[0] + "_call.png";
               document.getElementById(avatarname).src = avatarimage;
               $("#botspeech1").text("All In...");
               $("#botspeech1").show().delay(5000).fadeOut();
               document.getElementById("bbet1").style.background = "red";
               }
               if (n == 2)
               {
               var avatarname = "avatar" + botarray[1];
               var avatarimage = "avatar/_bot" + botarray[1] + "_call.png";
               document.getElementById(avatarname).src = avatarimage;
               $("#botspeech2").text("All In...");
               $("#botspeech2").show().delay(5000).fadeOut();
               document.getElementById("bbet2").style.background = "red";
               }
               if (n == 3)
               {
                var avatarname = "avatar" + botarray[2];
               var avatarimage = "avatar/_bot" + botarray[2] + "_call.png";
               document.getElementById(avatarname).src = avatarimage;
               $("#botspeech3").text("All In...");
               $("#botspeech3").show().delay(5000).fadeOut();
               document.getElementById("bbet3").style.background = "red";
               }
               if (n == 4)
               {
               var avatarname = "avatar" + botarray[3];
               var avatarimage = "avatar/_bot" + botarray[3] + "_call.png";
               document.getElementById(avatarname).src = avatarimage;
               $("#botspeech4").text("All In...");
               $("#botspeech4").show().delay(5000).fadeOut();
               document.getElementById("bbet4").style.background = "red";
               }
               if (n == 5)
               {
               var avatarname = "avatar" + botarray[4];
               var avatarimage = "avatar/_bot" + botarray[4] + "_call.png";
               document.getElementById(avatarname).src = avatarimage;
               $("#botspeech5").text("All In...");
               $("#botspeech5").show().delay(5000).fadeOut();
               document.getElementById("bbet5").style.background = "red";
               }
               if (n == 6)
               {
               var avatarname = "avatar" + botarray[5];
               var avatarimage = "avatar/_bot" + botarray[5] + "_call.png";
               document.getElementById(avatarname).src = avatarimage;
               $("#botspeech6").text("All In...");
               $("#botspeech6").show().delay(5000).fadeOut();
               document.getElementById("bbet6").style.background = "red";
               }
               if (n == 7)
               {
               var avatarname = "avatar" + botarray[6];
               var avatarimage = "avatar/_bot" + botarray[6] + "_call.png";
               document.getElementById(avatarname).src = avatarimage;
               $("#botspeech7").text("All In...");
               $("#botspeech7").show().delay(5000).fadeOut();
               document.getElementById("bbet7").style.background = "red";
               }
               if (n == 8)
               {
               var avatarname = "avatar" + botarray[7];
               var avatarimage = "avatar/_bot" + botarray[7] + "_call.png";
               document.getElementById(avatarname).src = avatarimage;
               $("#botspeech8").text("All In...");
               $("#botspeech8").show().delay(5000).fadeOut();
               document.getElementById("bbet8").style.background = "red"; 
               }
               if (n == 9)
               document.getElementById("bbet9").style.background = "red"; 
               
    if (n == 0) {
      HUMAN_GOES_ALL_IN = 1;
      
    }
  } else {

    bet_text = allin + "$" + players[n].subtotal_bet +
               " (" + (players[n].subtotal_bet + players[n].total_bet) + ")";
               (players[n].subtotal_bet + players[n].total_bet) + ")";
               

 
  }

  gui_set_player_name(players[n].name, n);    // offset 1 on seat-index
  gui_set_bet(bet_text, n);
  gui_set_bankroll(players[n].bankroll, n);
  gui_set_player_cards(carda, cardb, n, show_folded);
}

function make_readable_rank (r) {
  if (r < 11) {
    return r;
  } else if (r == 11) {
    return "J";
  } else if (r == 12) {
    return "Q";
  } else if (r == 13) {
    return "K";
  } else if (r == 14) {
    return "A";
  }
}

var remainder = 0;
function multiplies10(toCheck) {
  
  var xxx = Math.floor(toCheck / 10);
  return xxx;
  
}
function multiplies5(toCheck) {
  
  var xxx = Math.floor(toCheck / 5);
  return xxx;
  
}
function multiplies25(toCheck) {
  
  var xxx = Math.floor(toCheck / 25);
  return xxx;
  
}
function multiplies100(toCheck) {
  
  var xxx = Math.floor(toCheck / 100);
  return xxx;
  
}
function multiplies1000(toCheck) {
  
  var xxx = Math.floor(toCheck / 1000);
  return xxx;
  
}
var randomtop = 280;
var randomleft = 354;
var potposition = 0;
var graphicpot = 0;
function get_pot_size () {
  var p = 0;
  for (var i = 0; i < players.length; i++) {
    p += players[i].total_bet + players[i].subtotal_bet;
  }
        for (var x = 0; x < 20; x++)
        {
        document.getElementById("mypokerchipred" + x).style.display = "none";   
        document.getElementById("mypokerchipgreen" + x).style.display = "none"; 
        document.getElementById("mypokerchipblue" + x).style.display = "none"; 
        document.getElementById("mypokerchipblack" + x).style.display = "none";
        document.getElementById("mypokerchipgold" + x).style.display = "none"; 
        }
     remainder = p;
     var thousands = multiplies1000(remainder)
     remainder = remainder - (1000 * thousands);     
     var hundreds = multiplies100(remainder)
     remainder = remainder - (100 * hundreds);
     var twentyfives = multiplies25(remainder)
     remainder = remainder - (25 * twentyfives);
     var tens = multiplies10(remainder)
     remainder = remainder - (10 * tens);
     var fives = multiplies5(remainder)
     remainder = remainder - (5 * fives);


        for (var reds = 0; reds < fives; reds++)
        {
        if (randompokerchips < 20)
        {
        graphicpot = randomtop + potposition;
        document.getElementById("mypokerchipred" + randompokerchips).style.marginLeft = randomleft + "px";
        document.getElementById("mypokerchipred" + randompokerchips).style.marginTop = graphicpot + "px";
        document.getElementById("mypokerchipred" + randompokerchips).style.display = "block";
        document.getElementById("mypokerchipred" + randompokerchips).style.position = "absolute";
        }
        randompokerchips++; 
        potposition -= 3;
        }
  
        for (var blues = 0; blues < tens; blues++)
        {
        if (randompokerchips < 20)
        {
        graphicpot = randomtop + potposition;
        document.getElementById("mypokerchipblue" + randompokerchips).style.marginLeft = randomleft + "px";
        document.getElementById("mypokerchipblue" + randompokerchips).style.marginTop = graphicpot + "px";
        document.getElementById("mypokerchipblue" + randompokerchips).style.display = "block";
        document.getElementById("mypokerchipblue" + randompokerchips).style.position = "absolute";
        }
        randompokerchips++; 
        potposition -= 3;
        }
   
        for (var greens = 0; greens < twentyfives; greens++)
        {
        if (randompokerchips < 20)
        {
        graphicpot = randomtop + potposition;
        document.getElementById("mypokerchipgreen" + randompokerchips).style.marginLeft = randomleft + "px";
        document.getElementById("mypokerchipgreen" + randompokerchips).style.marginTop = graphicpot + "px";
        document.getElementById("mypokerchipgreen" + randompokerchips).style.display = "block";
        document.getElementById("mypokerchipgreen" + randompokerchips).style.position = "absolute";
        }
        potposition -= 3;
        randompokerchips++; 
        }
        for (var blacks = 0; blacks < hundreds; blacks++)
        {
        if (randompokerchips < 20)
        {
        graphicpot = randomtop + potposition;
        document.getElementById("mypokerchipblack" + randompokerchips).style.marginLeft = randomleft + "px";
        document.getElementById("mypokerchipblack" + randompokerchips).style.marginTop = graphicpot + "px";
        document.getElementById("mypokerchipblack" + randompokerchips).style.display = "block";
        document.getElementById("mypokerchipblack" + randompokerchips).style.position = "absolute";
        }
        potposition -= 3;
        randompokerchips++; 
        }  
        
        for (var golds = 0; golds < thousands; golds++)
        {
        if (randompokerchips < 20)
        {
        graphicpot = randomtop + potposition;
        document.getElementById("mypokerchipgold" + randompokerchips).style.marginLeft = randomleft + "px";
        document.getElementById("mypokerchipgold" + randompokerchips).style.marginTop = graphicpot + "px";
        document.getElementById("mypokerchipgold" + randompokerchips).style.display = "block";
        document.getElementById("mypokerchipgold" + randompokerchips).style.position = "absolute";
        }
        potposition -= 3;
        randompokerchips++; 
        }  
        randompokerchips = 0;
        graphicpot = 0;
        potposition = 0;
        audio6.play();
      
  return p;
}

function get_pot_size_html () {

  
    return "<font><b>TOTAL POT: " + get_pot_size() + "</b></font>";

}

function clear_bets () {
  for (var i = 0; i < players.length; i++) {
    players[i].subtotal_bet = 0;
  }
  current_bet_amount = 0;
}

function clear_pot () {
  for (var i = 0; i < players.length; i++) {
    players[i].total_bet = 0;
  }
}

function reset_player_statuses (type) {
  for (var i = 0; i < players.length; i++) {
    if (type == 0) {
      players[i].status = "";
    } else if (type == 1 && players[i].status != "BUST") {
      players[i].status = "";
    } else if (type == 2 &&
               players[i].status != "FOLD" &&
               players[i].status != "BUST") {
      players[i].status = "";
    }
  }
}

function get_num_betting () {
  var n = 0;
  for (var i = 0; i < players.length; i++) {
    if (players[i].status != "FOLD" &&
        players[i].status != "BUST" &&
        has_money(i)) {
      n++;
    }
  }
  return n;
}

function change_name () {
  var name = prompt("What is your name?", getLocalStorage("playername"));
  if (!name) {
    return;
  }
  if (!players) {
    my_pseudo_alert("Too early to get a name");
    return;
  }
  if (name.length > 14) {
    my_pseudo_alert("Too long, I will call you Sue");
    name = "Sue";
  }
  players[0].name = name;
  write_player(0, 0, 0);
  setLocalStorage("playername", name);
}

function help_func () {
  // Open help.html
  var url = 'cheatsheet.html';
  var win = window.open(url, '_blank');
  win.focus();
}

function update_func () {
  var url = 'https://sourceforge.net/projects/js-css-poker-fxmod/files/';
  var win = window.open(url, '_blank');
  win.focus();
}

function write_settings_frame () {
  var default_speed = 2;
  var speed_i = getLocalStorage("gamespeed");
  if (speed_i == "") {
    speed_i = default_speed;
  }
  if (speed_i == null ||
      (speed_i != 0 &&
       speed_i != 1 &&
       speed_i != 2 &&
       speed_i != 3 &&
       speed_i != 4)) {
    speed_i = default_speed;
  }
  set_speed(speed_i);
  gui_setup_option_buttons(change_name,
                           set_raw_speed,
                           help_func,
                           update_func,
                           gui_toggle_the_theme_mode);
}

function index2speed (index) {
  var speeds = ['2', '1', '.6', '.3', '0.01'];
  return speeds[index];
}

function set_speed (index) {
  global_speed = index2speed(index);
  setLocalStorage("gamespeed", index);
  gui_set_selected_speed_option(index);
}

function set_raw_speed (selector_index) {
  // check that selector_index = [1,5]
  if (selector_index < 1 || selector_index > 5) {
    my_pseudo_alert("Cannot set speed to " + selector_index);
    selector_index = 3;
  }
  var index = selector_index - 1;
  set_speed(index);
}

function get_next_player_position (i, delta) {
  var j = 0;
  var step = 1;
  if (delta < 0) step = -1;

  var loop_on = 0;
  do {
    i += step;
    if (i >= players.length) {
      i = 0;
    } else {
      if (i < 0) {
        i = players.length - 1;
      }
    }

    // Check if we can stop
    loop_on = 0;
    if (players[i].status == "BUST") loop_on = 1;
    if (players[i].status == "FOLD") loop_on = 1;
    if (++j < delta) loop_on = 1;
  } while (loop_on);

  return i;
}

function getLocalStorage (key) {
  return localStorage.getItem(key);
}

function setLocalStorage (key, value) {
  return localStorage.setItem(key, value);
}

function has_money (i) {
  if (players[i].bankroll >= 0.01) {
    return true;
  }
  return false;
}

function compRan () {
  return 0.5 - Math.random();
}

function my_local_subtime (invalue, fractionizer) {
  var quotient = 0;
  var remainder = invalue;
  if (invalue > fractionizer) {
    quotient = Math.floor(invalue / fractionizer);
    remainder = invalue - quotient * fractionizer;
  }
  return [quotient, remainder];
}

function getTimeText (string, number, text) {
  if (number == 0) return string;
  if (string.length > 0) {
    string += " ";
  }
  if (number == 1) {
    string = string + "1 " + text;
  } else {
    string = string + number + " " + text + "s";
  }
  return string;
}

function makeTimeString (milliseconds) {
  var _MS_PER_SECOND = 1000;
  var _MS_PER_MINUTE = 1000 * 60;
  var _MS_PER_HOUR = _MS_PER_MINUTE * 60;
  var _MS_PER_DAY = 1000 * 60 * 60 * 24;
  var _MS_PER_WEEK = _MS_PER_DAY * 7;
  var weeks = 0;
  var days = 0;
  var hours = 0;
  var minutes = 0;
  var seconds = 0;
  [weeks, milliseconds] = my_local_subtime(milliseconds, _MS_PER_WEEK);
  [days, milliseconds] = my_local_subtime(milliseconds, _MS_PER_DAY);
  [hours, milliseconds] = my_local_subtime(milliseconds, _MS_PER_HOUR);
  [minutes, milliseconds] = my_local_subtime(milliseconds, _MS_PER_MINUTE);
  [seconds, milliseconds] = my_local_subtime(milliseconds, _MS_PER_SECOND);

  var string = "";
  string = getTimeText(string, weeks, "week");
  string = getTimeText(string, days, "day");
  string = getTimeText(string, hours, "hour");
  string = getTimeText(string, minutes, "minute");
  string = getTimeText(string, seconds, "second");

  return (string);
}
