
var board = new Array();
var score = 0;

var hasConflicted = new Array();
$(document).ready(function(){
    newgame();
});

function newgame(){
    //初始化棋盘格
    init();
    //在随机两个格子生成数字
    generateOneNumber();
    generateOneNumber();
}

function init(){
    for( var i = 0 ; i < 4 ; i ++ )
        for( var j = 0 ; j < 4 ; j ++ ){

            var gridCell = $('#grid-cell-'+i+"-"+j);
            gridCell.css('top', getPosTop( i , j ) );
            gridCell.css('left', getPosLeft( i , j ) );
        }

    for( var i = 0 ; i < 4 ; i ++ ){
        board[i] = new Array();
        hasConflicted[i] = new Array();
        for( var j = 0 ; j < 4 ; j ++ ){
            board[i][j] = 0;
            hasConflicted[i][j] = false;
        }
    }

    updateBoardView();
    score = 0;
}

function updateBoardView(){

    $(".number-cell").remove();
    for( var i = 0 ; i < 4 ; i ++ )
        for( var j = 0 ; j < 4 ; j ++ ){
            $("#grid-container").append( '<div class="number-cell" id="number-cell-'+i+'-'+j+'"></div>' );
            var theNumberCell = $('#number-cell-'+i+'-'+j);

            if( board[i][j] == 0 ){
                theNumberCell.css('width','0px');
                theNumberCell.css('height','0px');
                theNumberCell.css('top',getPosTop(i,j) + 50);
                theNumberCell.css('left',getPosLeft(i,j) + 50);
            }
            else{
                theNumberCell.css('width','100px');
                theNumberCell.css('height','100px');
                theNumberCell.css('top',getPosTop(i,j));
                theNumberCell.css('left',getPosLeft(i,j));
                theNumberCell.css('background-color',getNumberBackgroundColor( board[i][j] ) );
                theNumberCell.css('color',getNumberColor( board[i][j] ) );
                theNumberCell.text( board[i][j] );
            }
            hasConflicted[i][j] = false;
        }
}

function generateOneNumber(){

    if( nospace( board ) )
        return false;
    //随机一个随机位置
    var randx = parseInt(Math.floor(Math.random()*4));
    var randy = parseInt(Math.floor(Math.random()*4));
    while(true){
        if(board[randx][randy] ==0){
            break;
        }
            
        randx = parseInt(Math.floor(Math.random()*4));
        randy = parseInt(Math.floor(Math.random()*4));
    }
    //随机一个数字
    var randNumber = Math.random() < 0.5 ? 2 :4;

    // 在随机位置显示随机数字
    board[randx][randy] = randNumber;
    showNumberWithAnimation(randx, randy, randNumber);
    return true;
}

$(document).keydown(function(event){
    switch(event.keyCode){
        case 37: //left
            if( moveLeft() ){
                setTimeout("generateOneNumber()",210);
                setTimeout("isgameover()",300);
            }
            break;
        case 38: //up
            if( moveUp() ){
                setTimeout("generateOneNumber()",210);
                setTimeout("isgameover()",300);
            }
            break;
        case 39: //right
            if( moveRight() ){
                setTimeout("generateOneNumber()",210);
                setTimeout("isgameover()",300);
            }
            break;
        case 40: //down
            if( moveDown() ){
                setTimeout("generateOneNumber()",210);
                setTimeout("isgameover()",300);
            }
            break;
        default: //default
            break;
        
    }
})
function isgameover(){
    if( nospace( board ) && nomove( board ) ){
        gameover();
    }
}

function gameover(){
    alert('gameover!');
}


function moveLeft(){
    if(!canMoveLeft(board)){
        return false;
    }

    // moveleft
    for(var i =0; i <4; i++){
        for(var j=1; j<4; j++){
            if(board[i][j]!=0){

                for(var k=0; k<j;k++){
                    if(board[i][k]==0 && noBlockHorizontal(i, k, j, board)){
                        showMoveAnimation(i, j, i, k);
                        board[i][k] = board[i][j];
                        board[i][j] = 0;
                        continue;
                    } else if (board[i][k]==board[i][j] && noBlockHorizontal(i, k, j, board) ){
                        //move
                        //add
                        showMoveAnimation(i, j, i, k);
                        board[i][k] += board[i][j];
                        board[i][j] = 0;
                        score += board[i][k];
                        updateScore(score);
                        continue;
                    }
                }
            }
        }
    }
    setTimeout("updateBoardView()",200);
    return true;
}





//moveRight
function moveRight(){
    if(!canMoveRight(board)){
        return false;
    }

    // moveRight
    for(var i =0; i <4; i++){
        for(var j=2; j>=0; j--){
            if(board[i][j]!=0){
                for(var k=3; k>j;k--){
                    if(board[i][k]==0 && noBlockHorizontal(i, j, k, board)){
                        showMoveAnimation(i, j, i, k);
                        board[i][k] = board[i][j];
                        board[i][j] = 0;
                        continue;
                    } else if (board[i][k]==board[i][j] && noBlockHorizontal(i, j, k, board)){
                        //move
                        //add
                        showMoveAnimation(i, j, i, k);
                        board[i][k] *= 2;
                        board[i][j] = 0;
                        score += board[i][k];
                        updateScore(score);
                        continue;
                    }
                }
            }
        }
    }
    setTimeout("updateBoardView()",200);
    return true;
}


// moveUp
function moveUp(){
    if(!canMoveUp(board)){
        return false;
    }

    // moveUp
    for(var i =0; i <4; i++){
        for(var j = 1; j<4; j++){
            if(board[j][i]!=0){
                for(var k=0; k<j;k++){
                    if(board[k][i]==0 && noBlockVertical(i, k, j, board)){
                        showMoveAnimation(j, i, k, i);
                        board[k][i] = board[j][i];
                        board[j][i] = 0;
                        continue;
                    } else if (board[k][i]==board[j][i] && noBlockVertical(i, k, j, board)){
                        //move
                        //add
                        showMoveAnimation(j, i, k, i);
                        board[k][i] *= 2;
                        board[j][i] = 0;
                        score += board[k][i];
                        updateScore(score);
                        continue;
                    }
                }
            }
        }
    }
    setTimeout("updateBoardView()",200);
    return true;
}






//moveDown
function moveDown(){
    if(!canMoveDown(board)){
        return false;
    }

    // moveDown
    for(var i =0; i <4; i++){
        for(var j=2; j>=0; j--){
            if(board[j][i]!=0){
                for(var k=3; k>j;k--){
                    if(board[k][i]==0 && noBlockVertical(i, j, k, board)){
                        showMoveAnimation(j, i, k, i);
                        board[k][i] = board[j][i];
                        board[j][i] = 0;
                        continue;
                    } else if (board[k][i]==board[j][i] && noBlockVertical(i, j, k, board)){
                        //move
                        //add
                        showMoveAnimation(j, i, k, i);
                        board[k][i] *= 2;
                        board[j][i] = 0;
                        score += board[k][i];
                        updateScore(score);
                        continue;
                    }
                }
            }
        }
    }
    setTimeout("updateBoardView()",200);
    return true;
}


