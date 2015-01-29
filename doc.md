Un patró de malabars no és res més que una sequencia de llançaments i recollida
de boles a certes alçades i en cert sentit que es van repetint periòdicament 
en el temps. La gràcia d'aquests patrons és que es poden modelitzar de manera 
molt senzilla sense tenir en compte el tipus d'objecte amb que fas malabars, 
la rapidesa amb que pases les boles  d'una mà a l'altra o la llei de gravitació 
que regeix el teu mon. 

Simplement hem de quantitzar el temps. És a dir, els esdeveniments que estudiarem 
succeïran en moments de temps múltiples d'un temps escollit arbitràriament al qual 
li direm `1`. El que passi en el doble de temps que `1` li direm `2`. El que passi en  
el triple de temps: `3`, etc. 

Per evitar allargar-me gaire en la introducció, faig referència a aquest enllaç 
(http://www.ensaimadamalabar.com/numerologia.htm) on s'explica de manera bastant 
intuitiva en què és un patró de malabars, com funciona i quines propietats ha de complir.
D'ara en endavant sol em centraré en explicar que és un patró malabar vàlid des 
d' una perspectiva matemàtica, encara que informal.

Un patró malabar vàlid de periode `p` es una seqüència de `p` nombres naturals 
amb les següents propietats:
1) La suma dels nombres naturals es divisible per `p` i el resultat de la divisió
és el nombre de boles.
2) Si a cada nombre de la seqüencia li sumem la posició on es troba i fem el mòdul de
`p`. La seqüencia de nombres resultants han de ser tots nombres diferents.
Exemples:
- La seqüencia [3,5,3,1] es un patró valid de periode 4 ja que si els hi sumem la 
posicio on es troben de la seqüencia ([3+0, 5+1, 3+2, 1+3]  = [3,6,5,4]) i després 
els hi fem modul 4 [3,2,1,0] surt una seqüencia amb nombres diferents.
- La seqüencia [8,3,5,0] *no* es un patró valid de periode 4 ja que si els hi sumem la 
posicio on es troben de la seqüencia ([8+0, 3+1, 5+2, 0+3]  = [8,4,7,3]) i després 
els hi fem modul 4 ([0,0,3,3]) surt una seqüencia on hi han nombres repetits.

3) Es consideren patrons equivalents aquells patrons que son seqüencies iguals
excepte rotacions. [5,3,1] es el mateix patró que [3,1,5] i [1,5,3]

4) Es considera que un patro de periode `p` es equivalent a un altre de periode `k*p`
si el patró de periode `k*p` es equivalent a la concatenació de k vegades el patró 
de periode `p`
Exemples: 
- El patró [5,1] es equivalent al patró [5,1,5,1] perquè la concatenació 
del primer dues vegades dona el segon
- El patró [4] es equivalent al patró [4,4,4] perquè la concatenació 
del primer quatre vegades dona el segon.

Per senzillesa, quan posem exemples amb xifres menors que 10, escriurem els 
patrons sense claudators i comes sense cap risc de confusió. Es a dir [5,3,1]
és el mateix que 531.

Arribats aquí, aquest codi vol solucionar el problema de generar patrons de malabars
amb `n` boles i d'un periode `p` en particular i d'una "alçada" de tir màxima `t`
sense generar patrons equivalents fent rotacions.

La solució per força bruta consistiria en generar totes les seqüencies numèriques
de periode `p` que sumin `p * t`, cribar les que no compleixin la propietat 2)
i després filtrar els patrons que siguin equivalents sol deixant-ne un.

No obstant, seria interessant trobar una manera ordenada de generar les seqüencies
per no haver de filtrar posteriorment els patrons que siguin equivalents. Per això, 
primer he pensat en crear una funció `patronsEspecifics(n, p, m)` de tres 
paràmetres que et doni tots els patrons de `n` boles amb periode `p`, que 
continguin almenys un tir d'alçada `m` i que no continguin tirs d'alçada més grans 
que `m`. D'aquesta manera, obtenir els patrons d'`n` boles, periode `p` i alçada `m`
es equivalent a obtenir la unió de la següent llista de patrons:
```
patronsEspecifics(n,p,t), patronsEspecifics(n,p,t-1) ... patronsEspecifics(n,p,1), patronsEspecifics(n,p,0)
```

Ara ho interessant es poder generar els patrons específics en cert ordre. Per exemple 
els patrons de periode 3, de 3 boles i un màxim d'alçada de 4 son:
423, 234, 342, 441, 414, 144
On surten molts patrons equivalents. Una primera idea per solucionar-ho es obligar que
les seqüències numèriques comencin per l'alçada màxima `m`. Llavors sortirien aquest
patrons:
423, 441, 414
Encara tenim els patrons equivalents 441 i 414. Una altra idea per obligar que no 
surtin aquest tipus de patrons repetits és no permetre que l'ultima xifra acabi 
en la màxima alçada. Asumirem que qualsevol seqüencia que acabi en l'alçada màxima
ja es pot representar amb un altra tipus de representació. Per exemple: 414 ja es
pot representar com 441 o 50505 ja es pot representar com 55050. Es cert que un
patró 333 no es pot representar de cap manera sense permetre que la alçada màxima
de l'última xifra sigui igual que la de la primera. No obstant això ja ens va bé
a la vegada per descartar aquests patrons que en realitat son de periode més 
petit (333 és equivalent a 3)

No obstant amb això no conseguim filtrar totes les seqüencies equivalents. Per 
exemple les seqüencies 53502 i 50253 compleixen les condicions requerides previament 
però segueixen sent eqivalents. Llavors la nova idea per evitar seqüències equivalents
és procurar que tot sufix estricte que comença amb l'alçada màxima sempre serà 
alfabèticament més petit que el prefix de mateixa longitud. En això es basa el meu
algorisme.

50253502 no serà un patró vàlid ja que el sufix 53502 no es menor que el prefix de 
mateixa longitud 50253.
531531 no serà un patró vàlid perque el sufix 531 no es menor que el prefix de la
mateixa longitud 531.
Amb aquesta condició podem observar que evitem generar seqüencies que siguin 
rotació d'una altra o seqüencies que es podin espressar amb un període més petit.

L'algorisme creat està basat en aquesta condició.