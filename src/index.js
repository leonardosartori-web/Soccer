import "./styles.css";
import Chart from "chart.js/auto";
import axios from "axios";

var results;

getRequest();
document.querySelector("#calcBtn").addEventListener("click", function () {
  getTeams();
});

function algorhytm(home, away, soglia, nameA, nameB) {
  console.log(home, away);
  var n = 60;
  var A = { goals: [0], e: 0 };
  var B = { goals: [0], e: 0 };
  for (var i = 0; i < n; ++i) {
    //var cost = (1 + Math.sqrt(5)) / 2;
    var cost = Math.E;
    //var cost = 1;
    var pA = (home * (i + 1)) / n + A.e + cost / n;
    var pB = (away * (i + 1)) / n + B.e + cost / n;
    //console.log(pA, pB);
    if (isToModify(pA - A.goals.length + 1, soglia)) {
      modiify(A);
    } else A.goals[A.goals.length - 1]++;

    if (isToModify(pB - B.goals.length + 1, soglia)) {
      modiify(B);
    } else B.goals[B.goals.length - 1]++;
  }
  console.log(A.goals);
  console.log(B.goals);
  var data = {
    A: nToPercentageArray(A.goals, n),
    B: nToPercentageArray(B.goals, n)
  };
  var div = document.querySelector("#graphs");
  div.innerHTML = "";
  var divTable = document.querySelector("#table");
  divTable.innerHTML = "";
  createChart(nameA, data.A, true);
  createChart(nameB, data.B, false);
  var table = _table_(data);
  var _1X2_ = _1x2_f(table);
  var _UO_ = _UO_f(table);
  var stats = document.querySelector("#table");
  stats.append(objToTable(_1X2_, ["1", "X", "2"]));
  stats.append(objToTable(_UO_, ["U", "O"]));
  _MULTIGOL_TOT_f(table);
}

function nToPercentageArray(ar, n) {
  var s = [];
  ar.forEach((el) => {
    var p = (el * 100) / n;
    p = truncer(p);
    s.push(p);
  });
  return s;
}

function truncer(n) {
  return Math.trunc(100 * n) / 100;
}

function isToModify(p, soglia) {
  return p > soglia;
}

function modiify(S) {
  S.goals.push(1);
  S.e -= 0.1;
}

function createChart(squadra, percentage, isHome) {
  var div = document.querySelector("#graphs");
  var ctx = document.createElement("canvas");
  if (isHome) ctx.id = "HomeChart";
  else ctx.id = "AwayChart";
  div.appendChild(ctx);
  let myCanvas = document.getElementById(ctx.id).getContext("2d");
  var arr = [];
  for (var i = 0; i < percentage.length; i++) {
    arr.push(i);
  }
  let myLabels = arr;
  let myData = percentage;

  let chart = new Chart(myCanvas, {
    type: "bar",
    data: {
      labels: myLabels,
      datasets: [
        {
          label: "Percentuale",
          data: myData,
          backgroundColor: "#ffa500",
          borderWidth: 0,
          borderColor: "#90caf9",
          hoverBorderWidth: 5
        }
      ]
    },
    options: {
      title: {
        display: true,
        text: squadra,
        fontSize: 16
      },
      legend: {
        display: true,
        position: "right"
      },
      layout: {
        padding: {
          top: 20,
          bottom: 0
        }
      }
    }
  });
}

function getRequest() {
  var url =
    "https://sheets.googleapis.com/v4/spreadsheets/1jm6ExvWXib8RzDLpQUsCg6GFx3TciZNNjhqmAGBTsJ4/?key=AIzaSyDL6Ave9_iZ8U3xAnaujHUoo_qMeEFKkn4&includeGridData=true";
  axios
    .get(url)
    .then(function (response) {
      //console.log(response);
      var result = response.data.sheets[0].data[0].rowData;
      getData(result);
      console.log("Done!");
    })
    .catch(function (error) {
      console.log(error);
    });
}

function getData(data) {
  //console.log(data);
  var ar = [];
  for (const x of data) {
    var array = [];
    for (const y of x.values) {
      array.push(y.formattedValue);
    }
    ar.push(array);
  }
  //console.log(ar);
  results = ar;
  getTeamsSelect(results);
}

function searchTeam(ar, t) {
  for (var i = 0; i < ar.length; ++i) {
    if (ar[i][0] === t) {
      console.log("Find!");
      return i;
    }
  }
  console.log("NOT Find!");
}

function getTeams() {
  var homeTeam = document.getElementById("homeTeam").value;
  var awayTeam = document.getElementById("awayTeam").value;
  var ai = searchTeam(results, homeTeam);
  var bi = searchTeam(results, awayTeam);
  console.log(ai, bi);

  Calcola(results[ai], results[bi], results);
}

function Calcola(A, B, t) {
  var nome_casa = A[0];
  var nome_ospite = B[0];
  var g_casa_fatti = A[2];
  var g_ospite_fatti = B[3];
  var g_casa_subiti = A[4];
  var g_ospite_subiti = B[5];
  var n_p_casa = A[6];
  var n_p_ospite = B[7];
  var n_punti_casa = A[8];
  var n_punti_ospite = B[8];
  var n_5_punti_casa = A[9];
  var n_5_punti_ospite = B[9];
  var pos_casa = A[1];
  var pos_ospite = B[1];

  var lCasa = "Sì"; // document.getElementById("l_casa").value;
  var lOspite = "Sì"; // document.getElementById("l_ospite").value;
  /*var u_o = document.getElementById("u/o").value;
  var na = document.getElementById("Risultato_casa").value;
  var no = document.getElementById("Risultato_ospite").value;
  var m_da = document.getElementById("Multigol_da").value;
  var m_a = document.getElementById("Multigol_a").value;*/
  var normal = "Sì"; // document.getElementById("normal_media").value;
  var costante = (1 + Math.sqrt(5)) / 8;

  var l_casa = 0;
  var l_ospite = 0;
  if (lCasa === "Sì") l_casa = 1;
  if (lOspite === "Sì") l_ospite = 1;

  var m_g_casa_fatti = Media(g_casa_fatti, n_p_casa);
  var m_g_ospite_fatti = Media(g_ospite_fatti, n_p_ospite);
  var m_g_casa_subiti = Media(g_casa_subiti, n_p_casa);
  var m_g_ospite_subiti = Media(g_ospite_subiti, n_p_ospite);
  var scarto_casa = Scarto(n_5_punti_casa, n_punti_casa, n_p_casa);
  var scarto_ospite = Scarto(n_5_punti_ospite, n_punti_ospite, n_p_ospite);
  var s_casa = (2 * g_casa_subiti + 2 * g_casa_fatti) / 2;
  var altezza_casa = Altezza(g_casa_fatti, s_casa);
  var s_ospite = (2 * g_ospite_subiti + 2 * g_ospite_fatti) / 2;
  var altezza_ospite = Altezza(g_ospite_fatti, s_ospite);
  var c_casa = Coefficiente(pos_casa);
  var c_ospite = Coefficiente(pos_ospite);
  var lead_casa = there_Leader(l_casa, costante, c_casa);
  var lead_ospite = there_Leader(l_ospite, costante, c_ospite);
  var base_casa_fatti = Base(
    m_g_casa_fatti,
    scarto_casa,
    altezza_casa,
    c_casa,
    costante,
    lead_casa
  );
  var base_casa_subiti = Base(
    m_g_casa_subiti,
    0,
    altezza_ospite,
    c_ospite,
    costante,
    0
  );
  var base_ospite_fatti = Base(
    m_g_ospite_fatti,
    scarto_ospite,
    altezza_ospite,
    c_ospite,
    costante,
    lead_ospite
  );
  var base_ospite_subiti = Base(
    m_g_ospite_subiti,
    0,
    altezza_casa,
    c_casa,
    costante,
    0
  );

  var K = (1 + Math.sqrt(5)) / (2 * 0.6);
  var z = Math.abs(c_casa - c_ospite);

  var base_squadra_casa =
    (base_casa_fatti * base_ospite_subiti) / (1.44 + c_casa * (K - 1)) + z;
  var base_squadra_ospite =
    (base_ospite_fatti * base_casa_subiti) / (1.44 + c_ospite * (K - 1)) + z;

  if (normal === "Sì") {
    base_squadra_casa = Media(base_casa_fatti + base_ospite_subiti, 2);
    base_squadra_ospite = Media(base_ospite_fatti + base_casa_subiti, 2);
  }
  if (isNaN(base_squadra_casa)) base_squadra_casa = 0;
  if (isNaN(base_squadra_ospite)) base_squadra_ospite = 0;

  var quoziente_casa = Math.trunc(base_squadra_casa);
  var quoziente_ospite = Math.trunc(base_squadra_ospite);

  var costante_add = (Math.sqrt(5) - 1) / 10;

  var base_squadra_casa_effettiva = controllo_add(
    base_squadra_casa,
    quoziente_casa,
    costante_add
  );
  var base_squadra_ospite_effettiva = controllo_add(
    base_squadra_ospite,
    quoziente_ospite,
    costante_add
  );
  console.log(
    base_squadra_casa_effettiva + " , " + base_squadra_ospite_effettiva
  );

  var ac = (A[10].slice(0, 3) / 4 - 64) / 10;
  var bc = (B[10].slice(0, 3) / 4 - 64) / 10;

  var at = Number(A[6]) + Number(A[7]);
  var bt = Number(B[6]) + Number(B[7]);
  console.log(base_squadra_casa_effettiva + ", " + ac + ", " + (at + 1));
  console.log(base_squadra_ospite_effettiva + ", " + bc + ", " + (bt + 1));

  var ris_a = Number(base_squadra_casa_effettiva) + ac;
  var ris_b = Number(base_squadra_ospite_effettiva) + bc;

  if (at > 0)
    ris_a = (Number(base_squadra_casa_effettiva) * at + ac) / (at + 1);
  if (bt > 0)
    ris_b = (Number(base_squadra_ospite_effettiva) * bt + bc) / (bt + 1);
  ris_a += getNecessity(A[0], t, t.length - 3);
  ris_a += getNecessity(A[0], t, 3);
  ris_b += getNecessity(B[0], t, t.length - 3);
  ris_b += getNecessity(B[0], t, 3);
  console.log(ris_a + " , " + ris_b);

  algorhytm(ris_a, ris_b, 0.95, nome_casa, nome_ospite);
}

function Media(a, b) {
  if (b === 0) return 0;
  else return a / b;
}

function Scarto(punti_cinque, punti_totali, n_partite) {
  var media_ultime = Media(punti_cinque, 5);
  var media_resto = Media(punti_totali - punti_cinque, 2 * n_partite - 5);
  return media_ultime - media_resto;
}

function Altezza(p1, p2) {
  return Media(p1, p2);
}

function Coefficiente(pos) {
  if (pos <= 5) {
    return 0.5;
  } else if (pos > 5 && pos < 15) {
    return 0.2;
  } else return 0;
}
function there_Leader(a, cost, coeff) {
  return a * cost - coeff;
}

function Base(media, scarto, altezza, coefficiente, costante, leader) {
  return media + (scarto + altezza) * costante + coefficiente + leader;
}

function controllo_add(base, quoziente, costante) {
  if ((base - quoziente < 0, 95)) base += costante;
  return base;
}

function getNecessity(S, t, r) {
  var n = searchTeam(t, S);
  var n_matches_risk = t[r][6] + t[r][7];
  var remaining_risk = 2 * (t.length - 1) - n_matches_risk;
  var max_point_risk = remaining_risk * 3;
  var save = t[n][8] > t[r][8] + max_point_risk;

  if (!save) {
    var n_matches = t[n][6] + t[n][7];
    var remaining_matches = 2 * (t.length - 1) - n_matches;
    var possibility = t[n][8] + 3 * remaining_matches > t[r][8];
    if (possibility) {
      return 0.4;
    } else return 0.25;
  } else return 0.0;
}

function getTeamsSelect(teams) {
  for (var i = 0; i < teams.length; ++i) {
    var tA = document.getElementById("homeTeam");
    var optionA = document.createElement("option");
    optionA.text = teams[i][0];
    tA.add(optionA, tA[tA.length]);
    var tB = document.getElementById("awayTeam");
    var optionB = document.createElement("option");
    optionB.text = teams[i][0];
    tB.add(optionB, tB[tB.length]);
  }
}

function _table_(data) {
  var homeAway = [];
  for (let i = 0; i < data.A.length; i++) {
    var home = [];
    for (let j = 0; j < data.B.length; j++) {
      home.push((data.A[i] * data.B[j]) / 100);
    }
    homeAway.push(home);
  }
  console.log("Table:");
  console.log(homeAway);
  return homeAway;
}

function _1x2_f(data) {
  var AXB = {
    A: 0,
    X: 0,
    B: 0
  };
  for (const x of data) {
    var i = data.indexOf(x);
    for (const y of x) {
      var j = x.indexOf(y);
      if (i > j) {
        AXB.A += truncer(y);
      } else if (i === j) {
        AXB.X += truncer(y);
      } else if (i < j) {
        AXB.B += truncer(y);
      }
    }
  }
  console.log("1X2:");
  console.log(AXB);
  return AXB;
}

function _UO_f(data) {
  var UO = { U: [], O: [] };
  for (var t = 0; t < 6; ++t) {
    UO.U.push(0);
    UO.O.push(0);
    for (const x of data) {
      var i = data.indexOf(x);
      for (const y of x) {
        var j = x.indexOf(y);
        if (i + j < t + 0.5) {
          UO.U[t] += truncer(y);
        } else if (i + j > t + 0.5) {
          UO.O[t] += truncer(y);
        }
      }
    }
  }
  console.log("UO: ");
  console.log(UO);
  return UO;
}

function _MULTIGOL_TOT_f(data) {
  var M = [];
  for (var t = 1; t < 6; ++t) {
    var multigol = [];
    for (var z = t + 1; z < 6; ++z) {
      var p = 0;
      for (const x of data) {
        var i = data.indexOf(x);
        for (const y of x) {
          var j = x.indexOf(y);
          if (i + j >= t && i + j <= z) {
            p += truncer(y);
          }
        }
      }
      multigol.push(p);
    }
    M.push(multigol);
  }
  console.log("MULTIGOL: ");
  console.log(M);
  return M;
}

function generateTable(data) {
  var table = document.createElement("table");
  for (const x of data) {
    var row = document.createElement("tr");
    var i = data.indexOf(x);
    for (const y of x) {
      var j = x.indexOf(y);
      var cell = document.createElement("td");
      if (i === 0) {
        cell.style.fontWeight = "bold";
      }
      cell.innerText = y;
      row.append(cell);
    }
    table.appendChild(row);
  }
  var div = document.querySelector("#table");
  div.appendChild(table);
  console.log("Tabella");
}

function objToTable(data, headers) {
  var table = document.createElement("table");
  //Make headers
  var row = document.createElement("tr");
  for (const x of headers) {
    var cell = document.createElement("td");
    cell.style.fontWeight = "bold";
    cell.innerText = x;
    row.append(cell);
  }
  table.appendChild(row);
  //Make rest of table
  var obj = Object.values(data);
  if (Array.isArray(obj[0])) {
    for (let i = 0; i < obj[0].length; i++) {
      var row = document.createElement("tr");
      for (let j = 0; j < 2; j++) {
        var cell = document.createElement("td");
        cell.innerText = truncer(obj[j][i]);
        row.append(cell);
      }
      table.appendChild(row);
    }
  } else {
    var row = document.createElement("tr");
    for (const x of obj) {
      var cell = document.createElement("td");
      cell.innerText = truncer(x);
      row.append(cell);
    }
    table.appendChild(row);
  }
  return table;
}
