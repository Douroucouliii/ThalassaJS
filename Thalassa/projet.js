var Model = {
  segment_fen1: [],
  segment_fen2: [],
};
var liste_fen1 = []; //Liste pour récupérer les coordonnées des points
var liste_fen2 = [];
var alpha_fen1 = 0; //Variable alpha des 2 fenêtre pour le morphing
var alpha_fen2 = 0;
var mod1 = []; //Model des fenêtre 3 et 4
var mod2 = [];
var couleur = "grey"; //Couleur des segments

class Point {
  constructor(x, y) {
    Object.defineProperty(this, "x", {
      value: x,
      enumerable: true,
      writable: false,
      configurable: false,
    });
    Object.defineProperty(this, "y", {
      value: y,
      enumerable: true,
      writable: false,
      configurable: false,
    });
  }
  horizontalSymmetry(n) {
    return new Point(this.x, n + (n - this.y));
  }
  verticalSymmetry(n) {
    return new Point(n + (n - this.x), this.y);
  }
  average(p, alpha) {
    return new Point(
      this.x * (1 - alpha) + p.x * alpha,
      this.y * (1 - alpha) + p.y * alpha
    );
  }
  clone(p) {
    return new Point(p.x, p.y);
  }
}

class Segment {
  constructor(p1, p2, rgb) {
    Object.defineProperty(this, "p1", {
      value: p1,
      enumerable: true,
      writable: false,
      configurable: false,
    });
    Object.defineProperty(this, "p2", {
      value: p2,
      enumerable: true,
      writable: false,
      configurable: false,
    });
    Object.defineProperty(this, "rgb", {
      value: rgb,
      enumerable: true,
      writable: false,
      configurable: false,
    });
  }
  horizontalSymmetry(n) {
    var p1 = this.p1.horizontalSymmetry(n);
    var p2 = this.p2.horizontalSymmetry(n);

    return new Segment(p1, p2, this.rgb);
  }
  verticalSymmetry(n) {
    var p1 = this.p1.verticalSymmetry(n);
    var p2 = this.p2.verticalSymmetry(n);

    return new Segment(p1, p2, this.rgb);
  }
  average(p, alpha) {
    var p1 = this.p1.average(p.p1, alpha);
    var p2 = this.p2.average(p.p2, alpha);

    return new Segment(p1, p2, this.rgb);
  }
  clone() {
    return new Segment(this.p1, this.p2, this.rgb);
  }
}

document.addEventListener("DOMContentLoaded", main);

function main() {
  //fenetre d'édition 1
  var fenetre1 = document.getElementById("fenetre1");
  //fenetre d'édition 2
  var fenetre2 = document.getElementById("fenetre2");
  //boutons clear
  var button_clear1 = document.getElementById("clear1");
  var button_clear2 = document.getElementById("clear2");
  //boutons retour
  var button_retour1 = document.getElementById("retour1");
  var button_retour2 = document.getElementById("retour2");
  //bouton echange
  var button_echange = document.getElementById("echange");
  //boutons miroir
  var button_miroir1 = document.getElementById("miroir1");
  var button_miroir2 = document.getElementById("miroir2");
  //boutons morphing
  var button_morphing1 = document.getElementById("morphing1");
  var button_morphing2 = document.getElementById("morphing2");
  //boutons couleur
  var btn_rouge = document.getElementById("rouge");
  var btn_bleu = document.getElementById("bleu");
  var btn_vert = document.getElementById("vert");
  var btn_orange = document.getElementById("orange");
  var btn_jaune = document.getElementById("jaune");
  var btn_grey = document.getElementById("grey");

  repaint();

  //Au clic gauche, on ajoute les point dans le model
  fenetre1.addEventListener("click", add_model_fen1);
  fenetre2.addEventListener("click", add_model_fen2);

  //Au clic gauche sur les boutons clear, on réinitialise le model
  button_clear1.addEventListener("click", clear_modele_fen1);
  button_clear2.addEventListener("click", clear_modele_fen2);

  //Au clic gauche sur les boutons retour, on enlève le dernier segment du model
  button_retour1.addEventListener("click", retour_fen1);
  button_retour2.addEventListener("click", retour_fen2);

  //Au clic gauche sur le bouton echange, on échange les 2 models
  button_echange.addEventListener("click", echange_modele);

  //Au clic gauche sur les boutons miroir, on prend la symétrie de chaque segment et on réaffiche le model
  button_miroir1.addEventListener("click", miroir_fen1);
  button_miroir2.addEventListener("click", miroir_fen2);

  //Au clic gauche sur les boutons morphing, on lance le morphing
  button_morphing1.addEventListener("click", morphing1);
  button_morphing2.addEventListener("click", morphing2);

  //Palette de couleur : on gère les clics sur les boutons
  btn_rouge.addEventListener("click", () => {
    couleur = "red";
  });
  btn_bleu.addEventListener("click", () => {
    couleur = "blue";
  });
  btn_vert.addEventListener("click", () => {
    couleur = "green";
  });
  btn_orange.addEventListener("click", () => {
    couleur = "orange";
  });
  btn_jaune.addEventListener("click", () => {
    couleur = "yellow";
  });
  btn_grey.addEventListener("click", () => {
    couleur = "grey";
  });

  return;
}

function repaint() {
  console.log(Model.segment_fen1);
  //fenetre d'édition 1
  var fenetre1 = document.getElementById("fenetre1");
  //fenetre d'édition 2
  var fenetre2 = document.getElementById("fenetre2");
  //fenetre d'édition 3
  var fenetre3 = document.getElementById("fenetre3");
  //fenetre d'édition 4
  var fenetre4 = document.getElementById("fenetre4");
  //ctx de la fenetre d'édition 1
  let ctx1 = fenetre1.getContext("2d");
  //ctx de la fenetre d'édition 2
  let ctx2 = fenetre2.getContext("2d");
  //ctx de la fenetre d'édition 3
  let ctx3 = fenetre3.getContext("2d");
  //ctx de la fenetre d'édition 4
  let ctx4 = fenetre4.getContext("2d");

  //On efface tout et on redessine tout (comme ça si on appuie sur le bouton clear, on efface tout et on réaffiche rien)
  ctx1.clearRect(0, 0, 400, 300);
  ctx2.clearRect(0, 0, 400, 300);
  ctx3.clearRect(0, 0, 400, 300);
  ctx4.clearRect(0, 0, 400, 300);
  paint(ctx1, Model.segment_fen1);
  paint(ctx2, Model.segment_fen2);
  return;
}

function paint(ctx, tab) {
  ctx.strokeStyle = "grey";
  ctx.lineWidth = 5;
  tab.forEach((i) => {
    ctx.beginPath();
    ctx.strokeStyle = i.rgb;
    //On se déplace aux coordonnées du premier du premier point du segment
    ctx.moveTo(i.p1.x, i.p1.y);
    //et on trace une ligne jusqu'au deuxième point du segment
    ctx.lineTo(i.p2.x, i.p2.y);
    ctx.closePath();
    ctx.stroke();
  });
  return;
}

function add_model_fen1(e) {
  //On supprime l'affiche du modèle dans la fenetre3
  var fenetre3 = document.getElementById("fenetre3");
  let ctx3 = fenetre3.getContext("2d");
  ctx3.clearRect(0, 0, 400, 300);
  mod1 = [];
  //On commence une nouvelle polyligne si shift a été pressé
  if (e.shiftKey) {
    liste_fen1 = [];
  }
  //On récupère les coordonées du clic
  var [x, y] = get_coordinates(e);
  //On crée un point avec les coordonnées et on l'ajoute à la liste
  var point = new Point(x, y);
  liste_fen1.push(point);
  //Si la liste est égale à 2, on crée un segment qu'on ajoute au model, et on remet dans la liste le dernier point
  if (liste_fen1.length == 2) {
    var segment = new Segment(liste_fen1[0], liste_fen1[1], couleur);
    Model.segment_fen1.push(segment);
    liste_fen1 = [liste_fen1[1]];
  }
  //On redessine le model dans le canvas
  repaint();
  return;
}

function add_model_fen2(e) {
  //On supprime l'affiche du modèle dans la fenetre4
  var fenetre4 = document.getElementById("fenetre4");
  let ctx4 = fenetre4.getContext("2d");
  ctx4.clearRect(0, 0, 400, 300);
  mod2 = [];
  //On commence une nouvelle polyligne si shift a été pressé
  if (e.shiftKey) {
    liste_fen2 = [];
  } //On récupère les coordonées du clic
  var [x, y] = get_coordinates(e); //On crée un point avec les coordonnées et on l'ajoute à la liste
  var point = new Point(x, y);
  liste_fen2.push(point); //Si la liste est égale à 2, on crée un segment qu'on ajoute au model, et on remet dans la liste le dernier point
  if (liste_fen2.length == 2) {
    var segment = new Segment(liste_fen2[0], liste_fen2[1], couleur);
    Model.segment_fen2.push(segment);
    liste_fen2 = [liste_fen2[1]];
  } //On redessine le model dans le canvas
  repaint();
  return;
}

function get_coordinates(e) {
  //On récupère l'élément qui produit l'événement
  const fen = e.currentTarget; //On demande le rectangle qui englobe le canvas

  const rect = fen.getBoundingClientRect(); //On calcule les coordonnées de la souris au moment du click

  const x = e.clientX - rect.left;
  const y = e.clientY - rect.top;

  return [x, y];
}

function clear_modele_fen1() {
  //On supprime l'affiche du modèle dans la fenetre3
  var fenetre3 = document.getElementById("fenetre3");
  let ctx3 = fenetre3.getContext("2d");
  ctx3.clearRect(0, 0, 400, 300);
  mod1 = [];
  //On clear la fenetre 1
  Model.segment_fen1 = [];
  liste_fen1 = [];
  repaint();
  return;
}

function clear_modele_fen2() {
  //On supprime l'affiche du modèle dans la fenetre4
  var fenetre4 = document.getElementById("fenetre4");
  let ctx4 = fenetre4.getContext("2d");
  ctx4.clearRect(0, 0, 400, 300);
  mod2 = [];
  //On clear la fenetre 2
  Model.segment_fen2 = [];
  liste_fen2 = [];
  repaint();
  return;
}

function retour_fen1() {
  //On supprime l'affiche du modèle dans la fenetre3
  var fenetre3 = document.getElementById("fenetre3");
  let ctx3 = fenetre3.getContext("2d");
  ctx3.clearRect(0, 0, 400, 300);
  mod1 = [];
  //retour
  var dernier_segment = Model.segment_fen1.pop();
  if (dernier_segment != undefined) {
    liste_fen1 = [dernier_segment.p1];
    repaint();
  } else {
    liste_fen1 = [];
  }
  return;
}

function retour_fen2() {
  //On supprime l'affiche du modèle dans la fenetre4
  var fenetre4 = document.getElementById("fenetre4");
  let ctx4 = fenetre4.getContext("2d");
  ctx4.clearRect(0, 0, 400, 300);
  mod2 = [];
  //retour
  var dernier_segment = Model.segment_fen2.pop();
  if (dernier_segment != undefined) {
    liste_fen2 = [dernier_segment.p1];
    repaint();
  } else {
    liste_fen2 = [];
  }
  return;
}

function echange_modele() {
  //On supprime l'affiche du modèle dans la fenetre 3 et 4
  var fenetre3 = document.getElementById("fenetre3");
  let ctx3 = fenetre3.getContext("2d");
  ctx3.clearRect(0, 0, 400, 300);
  mod1 = [];
  var fenetre4 = document.getElementById("fenetre4");
  let ctx4 = fenetre4.getContext("2d");
  ctx4.clearRect(0, 0, 400, 300);
  mod2 = [];
  //On échange les 2 tableaux de segments, puis on échange les 2 listes qui stock le point de l'ancien segment
  var tab = Model.segment_fen1;
  Model.segment_fen1 = Model.segment_fen2;
  Model.segment_fen2 = tab;
  var liste = liste_fen1;
  liste_fen1 = liste_fen2;
  liste_fen2 = liste;
  repaint();
  return;
}

function miroir_fen1() {
  //On supprime l'affiche du modèle dans la fenetre 3 et 4
  var fenetre3 = document.getElementById("fenetre3");
  let ctx3 = fenetre3.getContext("2d");
  ctx3.clearRect(0, 0, 400, 300);
  mod1 = [];
  var fenetre4 = document.getElementById("fenetre4");
  let ctx4 = fenetre4.getContext("2d");
  ctx4.clearRect(0, 0, 400, 300);
  mod2 = [];
  //Pour chaque segment, on prend sa symétrie verticale
  Model.segment_fen1.forEach((i, index) => {
    Model.segment_fen1[index] = i.verticalSymmetry(200);
  });
  //On prend la symétrie du dernier point stocké dans la liste
  liste_fen1[0] = liste_fen1[0].verticalSymmetry(200);
  repaint();
  return;
}

function miroir_fen2() {
  //On supprime l'affiche du modèle dans la fenetre 3 et 4
  var fenetre3 = document.getElementById("fenetre3");
  let ctx3 = fenetre3.getContext("2d");
  ctx3.clearRect(0, 0, 400, 300);
  mod1 = [];
  var fenetre4 = document.getElementById("fenetre4");
  let ctx4 = fenetre4.getContext("2d");
  ctx4.clearRect(0, 0, 400, 300);
  mod2 = [];
  //Pour chaque segment, on prend sa symétrie verticale
  Model.segment_fen2.forEach((i, index) => {
    Model.segment_fen2[index] = i.verticalSymmetry(200);
  });
  //On prend la symétrie du dernier point stocké dans la liste
  liste_fen2[0] = liste_fen2[0].verticalSymmetry(200);
  repaint();
  return;
}

function morphing1() {
  if (Model.segment_fen1 == 0 || Model.segment_fen2 == 0) {
    return;
  }
  if (Model.segment_fen1.length !== Model.segment_fen2.length) {
    rendre_egale();
  }
  //On affiche le model dans la 3eme fenêtre
  var fenetre3 = document.getElementById("fenetre3");
  let ctx3 = fenetre3.getContext("2d");
  ctx3.clearRect(0, 0, 400, 300);
  mod1 = [];
  paint(ctx3, Model.segment_fen1);
  //On stock le model actuel dans une variable mod1
  Model.segment_fen1.forEach((i) => {
    mod1.push(i.clone());
  });
  //On fait un setInterval qui pour chaque segment, va le pondérer par alpha par rapport à l'autre segment (puis on incrémente alpha)
  var set1 = window.setInterval(() => {
    mod1.forEach((i, index) => {
      mod1[index] = i.average(Model.segment_fen2[index], alpha_fen1);
    });
    alpha_fen1 += 0.01;
    if (alpha_fen1 > 1) {
      window.clearInterval(set1);
      alpha_fen1 = 0;
    }
    ctx3.clearRect(0, 0, 400, 300);
    paint(ctx3, mod1);
  }, 20);
}

function morphing2() {
  if (Model.segment_fen1 == 0 || Model.segment_fen2 == 0) {
    return;
  }
  if (Model.segment_fen1.length !== Model.segment_fen2.length) {
    rendre_egale();
  }
  //On affiche le model dans la 4eme fenetre
  var fenetre4 = document.getElementById("fenetre4");
  let ctx4 = fenetre4.getContext("2d");
  ctx4.clearRect(0, 0, 400, 300);
  mod2 = [];
  paint(ctx4, Model.segment_fen2);
  //On stock le model actuel dans une variable mod2
  Model.segment_fen2.forEach((i) => {
    mod2.push(i.clone());
  });
  //On fait un setInterval qui pour chaque segment, va le pondérer par alpha (puis on incrémente alpha)
  var set2 = window.setInterval(() => {
    mod2.forEach((i, index) => {
      mod2[index] = i.average(Model.segment_fen1[index], alpha_fen2);
    });
    alpha_fen2 += 0.01;
    if (alpha_fen2 > 1) {
      window.clearInterval(set2);
      alpha_fen2 = 0;
    }
    ctx4.clearRect(0, 0, 400, 300);
    paint(ctx4, mod2);
  }, 20);
}

function rendre_egale() {
  var cpt = 0;
  if (Model.segment_fen1 < Model.segment_fen2) {
    while (Model.segment_fen1.length !== Model.segment_fen2.length) {
      Model.segment_fen1.push(Model.segment_fen1[cpt].clone());
      cpt++;
      if (cpt === Model.segment_fen1.length) {
        cpt = 0;
      }
    }
  } else if (Model.segment_fen1.length > Model.segment_fen2.length) {
    while (Model.segment_fen1.length !== Model.segment_fen2.length) {
      Model.segment_fen2.push(Model.segment_fen2[cpt].clone());
      cpt++;
      if (cpt === Model.segment_fen2.length) {
        cpt = 0;
      }
    }
  }
}
