# tp9_client
Dieses Repository enthält den Client-Code des WebXR-Multiplayer-Projektes “Spatial Encounters”. Der Server-Code befindet  sich [hier](https://github.com/digitaldthg/tp9_webserver). Für die Premiere des Projektes wurden Oculus Quests 2 verwendet.

Die VR Experience “Spatial Encounters” hat im thüringischen Kloster Volkenroda am 27. und 28. August 2021 Premiere gefeiert und im Rahmen des Sommerkonzerte-Festivals  experimentelle und virtuelle Akzente gesetzt!

[Weiterlesen...](https://digital.dthg.de/spatial-encounters-sommerkonzerte-volkenroda/)

## Setup

### Server
Starten Sie den [Server](https://github.com/digitaldthg/tp9_webserver) auf einem beliebigen Rechner, der sich im selben WLAN wie das Gerät befindet, auf dem der Client gestartet wird. 

### Client
Ändern Sie die IP in <em>main.config.js</em> zur IP Ihres Servers und starten Sie den Client. Öffnen Sie die entsprechende url in einem Desktop-Browser. Wenn Sie die Seite auf einem Desktop öffnen können Sie die UI zum Steuern der Session sehen. Öffnen die Seite in einer VR-Brille können Sie die UI nicht sehen sondern stehen direkt in der Szene. 

## User Interface
Das User Interface ist nur im Desktop-View zu sehen.

| UI Element          | Beschreibung |
|---------------------|-------------------------------------------------------------------------------------------------------------------------------------------|
| Kalibrierung        | Aktiviert und Deaktiviert die Kalibirierung in allen verbundenen VR-Brillen                                                               | 
| Hide User Interface | Versteckt die UI - diese kann durch Klicken in der oberen rechten Ecke wieder angezeigt werden                                            |
| Präsentationsmodus  | Startet den Präsentationsmodus in Fullscreen - der Präsentationsmodus zeigt die 3D Szene gleichzeitig aus drei verschiedenen Perspektiven | 
| Autorotate Kamera | Rotiert die Kamera in der angegebenen Geschwindigkeit | 
| Visible | Unter dem 'Autorotate Kamera' Feld werden alle verbunden ID's aufgelistet. Durch die Toggle Buttons können diese einzeln sichtbar und unsichtbar gemacht werden. Man selber ist grau hinterlegt. |
| Teppich Opacity | Transparenz der türkis-pinken Fläche und des 'Daches' |
| Sek. zwischen Dreiecken | Sekunden zwischen den automatisch gespawnten Dreiecken. Wird diese auf 3 (Maximalwert) gesetzt erscheinen gar keine regelmäßigen Dreiecke. Dreicke können dann immer noch über den manuellen externen Input gespawnt werden. |
| Dreiecks Opacity | Transparenz des aktuellen Dreiecks |
| Geschwindigkeit der Dreiecke | Geschwindigkeit mit der alle sichtbaren Dreiecke in die Höhe fliegen|
| FogDistance | Definiert wie nah der 'Nebel' ist. Wenn null, ist gar keine Nebel zu sehen|
| Triangle Rotation Speed | Drehgeschwindigkeit der Dreiecke. Positiv und negativ definiert dabei die Drehrichtung |
| Animate to | Startet die Fog-Animation. Über dem Button kann festgelegt werden in welcher Zeit sich der FogDistance-Wert zu einen manuelle festegelegten Wert, 0 oder 0.5 verändern soll|
| Transitionzeit Slider | Definiert in wie viele Sekunden der Übergang von einem Theme zum nächsten dauert soll |
| Themes | Unter dem Transitionzeit Slider sind alle definerten Themes mit jeweiligem Play button aufgelistet. Durch Klicken auf einen Playbutton beginnt der Übergang vom aktuellen Theme zu diesem Theme.|

![UI](https://github.com/digitaldthg/TP9_frontendController/blob/main/images/UI.png)
 
## Themes

Während einer Session ist die Umgebung der 3D Szene durch Themes definiert, die gewechselt werden können. Jedes Theme wird durch eine .json definiert, die unter <em>/Themes</em> zu finden sind. Im <em>MaterialController.js</em> wird definiert welche des hinterlegt Themes auch in der UI sichtbar und damit auswählbar sein sollen.

## Konfiguration im Raum
Momentan ist die Spielfläche durch das importierte Guardian-Mesh und die Guardian-Aktivierungs-Grenzen auf ca 10x16m festgelegt (<em>Guardian.js</em>). 

Damit die virtuelle Räume aller verbunden VR-Brillen übereinstimmen müssen diese zu Beginn einmalig konfiguriert werden. Bevor Sie die Konfiguration starten stellen Sie sich dass diese eingeschalten ist. Im Desktop-View haben Sie dafür oben rechts einen Button. 

### 1. Rotation
Bestimmen Sie eine Richtung in die alle VR-Brillen ausgerichtet werden und drücken Sie dann die Oculus Taste auf dem Controller um die Rotation des virtuellen Raumes zu setzen. 

### 2. Offset
Bestimmen Sie einen Punkt im realen Raum. Stellen Sie sich mit aufgesetzter VR-Brille auf diesen Punkt und schauen Sie nach unten.

## Installation & Entwicklung
Das Projekt wurde mit [Vue 2](https://vuejs.org/) entwickelt und nutzt [three.js](https://threejs.org/) als WebGL Framework. Über [Sockets](https://www.npmjs.com/package/vue-socket.io) kommunzieren Client und Server miteinander. 

Klonen oder downloaden Sie das Projekt auf Ihren Rechner und installieren Sie die Dependencies mit den nachstehenden Befehlen. 

**Installation** `npm install`

**Development** `npm run serve`

**Build** `npm run build`

### Entry Points
**2D**

`src > main.js`

**3D**

`src > components > Scene.vue`

### Projektaufbau
Die Anwendung ist hauptsächlich durch 
- Raum (Scene.vue, Environment.vue)
- Spieler (Player.vue)
- andere Spieler (Friends.vue, SingleFriend.js)
- Dreiecke (constantTriangle.js, triangle.js, triangleUtils.js) 
- und UI (Controls.vue)

definiert. 





