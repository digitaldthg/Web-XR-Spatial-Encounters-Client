# Kreiiere ein Custom Theme
Anwendung wie gewohnt starten. In der Seitenleiste ist ein Link zum Editor. Alle möglichen Einstellungen für ein Theme sind hier hinterlegt:

## Allgemein
- FogColor
- PlayerColor
## Guardian
- Guardian Texture
## Skybox
- Skybox Texture
- Gradient Skybox Color
## Floor
- Floor Texure
## Fog Floor
- Fog Floor Color
- Fog Floor Alpha(b&w)
## Background Front
- Background Front
- Gradient Background Front(b&w)
## Background Back
- Background Back
- Gradient Background Back(b&w)
## Background Moving
- Background Moving
- Gradient Background Moving(b&w)
## Sun
- Sun Texture
- Gradient Sun Color(b&w)


# Speichern
Beim Speichern wird eine .zip Datei erstellt und automatisch heruntergeladen. Diese .zip Datei muss entpackt werden und in den Ordner **tp9_client > public > Custom_Themes** abgelegt werden. Der Themeordner enthält sowohl die .json Datei mit den jeweiligen Themesettings als auch alle Bilder die für das Theme benötigt werden.

# Theme einbinden
Nachdem der Themeordner abgelegt ist muss nun dem Frontend mitgeteilt werden welche Themes es laden soll. Das passiert in der Datei **tp9_client > src** > *CustomThemes.js*. Hier fügt man den Namen des Themes in den Array ein. 

Beispiel:
`export default ["THEMENAME_1","THEMENAME_2", ... ];`

*Die Reihenfolge der Themes wie sie in der Seitenleiste angezeigt werden wird hier mit festgelegt.*