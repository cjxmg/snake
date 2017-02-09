var title=document.querySelector(".title");
var wrap=document.querySelector(".wrap");
wrap.style.left=(document.documentElement.clientWidth-wrap.offsetWidth)/2+"px";
drag(title,wrap); //设置游戏框的拖拽

var ohScore=document.querySelector(".hScore");
var oScore=document.querySelector(".score");
var score=0;  //初始为0分
//设置最高分为之前存储过的最高分
if(localStorage.getItem('max')){
	ohScore.innerHTML="历史最高分 : "+localStorage.getItem('max')+"  分"; 
}

var ulBox=document.querySelector(".boxWrap");
var c=28;  //28列
var r=35;  //30行
var allArr=[];  //用于装入所有的盒子
//创建游戏区域所有的盒子
for (var i=0;i<r;i++) {
	var rArr=[];  //装入的是一排所有的盒子
	var rLi=document.createElement("li");
	rLi.className="clearfix";  //li清浮动
	for (var j=0;j<c;j++) {
		var box=document.createElement("div");
		rArr.push(box);
		rLi.appendChild(box);
	}
	ulBox.appendChild(rLi);
	allArr.push(rArr);
}

//蛇的移动
var stepTime; //蛇每走一步的时间
var moveTimer=null;  //定时器	
var direction='right';
var x=4,y=0;  //起始位置

function move(){
	moveTimer=setInterval(
		function(){
			switch (direction){
				case 'right':
					x++;
					break;
				case 'left':
					x--;
					break;
				case 'up':
					y--;
					break;
				case 'down':
					y++;
					break;
			}
			if (x<0 || y<0 || x>=c || y>=r) {
        		clearInterval(moveTimer);
				gameOver() //游戏结束
             	return;
            }
			if(x==eggX && y==eggY && allArr[eggY][eggX].className=='egg'){  //防止createEgg()函数在递归时产生的eggX和eggY的影响		
				snakeArr.push(allArr[eggY][eggX]);
				allArr[eggY][eggX].className="snake";
				score++;
				oScore.innerHTML='得分 : '+score+" 分";
				createEgg();
			}
			else{
				//判断蛇是否咬到自己
				if(allArr[y][x].className=="snake"){
					clearInterval(moveTimer);
					gameOver();  //游戏结束
					
				}
				snakeArr[0].className="";
				snakeArr.shift();
				allArr[y][x].className="snake";
				snakeArr.push(allArr[y][x]);
			}
		}
	,stepTime)
}

//添加键盘的对蛇的控制
var ks=true;  //阻止按键冲突，即防止下一次的按键覆盖上一次按键的操作	
document.onkeydown=function(event){
	if(!ks){
		return	
	}	
	//化解方向冲突，阻止蛇的原地反向
	if (event.keyCode == 37 && direction == 'right') {
        return;
    }
    if (event.keyCode == 39 && direction == 'left') {
        return;
    }
    if (event.keyCode == 40 && direction == 'up') {
        return;
    }
    if (event.keyCode == 38 && direction == 'down') {
        return;
    }
    //设置键盘方向键对蛇的控制
    switch (event.keyCode){
    	case 37:
    		direction="left";
    		break;
    	case 38:
    		direction="up";
    		break;
    	case 39:
    		direction="right";
    		break;
    	case 40:
    		direction="down";
    		break;
    }
    ks=false;
    setTimeout(
    	function(){
    		ks=true;
    	}
    ,stepTime)
    console.log(stepTime);
}

//生成随机位置的蛋
var eggX,eggY; //蛋的位置索引
function createEgg(){
	eggX=parseInt(Math.random()*c);
	eggY=parseInt(Math.random()*r);
	if(allArr[eggY][eggX].className!='snake'){
		allArr[eggY][eggX].className='egg';
	}
	else{
		createEgg();
	}
}
createEgg();

//开始按钮的点击事件 ,以及初中高游戏等级的选择按钮
var btn=document.getElementById("btn");
var snakeArr=[]; //用于装入蛇身体所有的方块
var btnChoose=document.querySelectorAll(".choose");
for (var i=0;i<btnChoose.length;i++) {
	btnChoose[i].style.background='gray';  //先将所有难度按钮变灰
	//定义难度按钮的点击事件
	btnChoose[i].onclick=function(){
		for (var j=0;j<btnChoose.length;j++) {
			btnChoose[j].style.background='gray';
		}
		this.style.background=''; //此难度被选中
	}
}
btn.onclick=function(){	
	init();   //游戏初始化
	//判断用户选择的游戏难度
	if(btnChoose[0].style.background==''){
		stepTime=280;  //初级难度	
	}
	else if(btnChoose[1].style.background==''){
		stepTime=140;  //中级难度	
	}
	else if(btnChoose[2].style.background==''){
		stepTime=70;  //高级难度	
	}
	else{
		alert('请选择游戏难度~ (^_^)');
		return
	}
	//封面收起特效
	btn.parentNode.style.transform='rotate(180deg) scale(0)';
	move();
}

/* 停止游戏，并弹出成绩,并记录最高分
 */
var gameOverBox=document.querySelector(".gameOver");
function gameOver(){
	gameOverBox.innerHTML='<font size="8" color="red">game over</font><br/>'+"你的得分  : "+score+'<span id="again">再来一次</span>'+'<span id="quit">退出游戏</span>';
	gameOverBox.style.transform="scale(1)";
	
	//退出游戏按钮的点击事件
	document.getElementById("quit").onclick=function(){
		btn.parentNode.style.transform='rotate(0deg) scale(1)';
		gameOverBox.style.transform="scale(0)";
	}
	
	//设置再来一次按钮的点击事件
	document.getElementById("again").onclick=function(){
		gameOverBox.style.transform="scale(0)";
		init();
		move();
	}
	
	//设置最高分为web存储
	var h=localStorage.getItem('max');
	if (h==null||h<score) {
    	localStorage.setItem('max',score);
        h=score;
    }
	ohScore.innerHTML="历史最高分 : "+h+"  分";
}

/* 游戏初始化，将蛇身数组初始化
 * 并将之前的蛋复原，重新产蛋
 * 还有方向等一些设置
 */
function init(){
	for (var i=0;i<snakeArr.length;i++) {
		snakeArr[i].className='';  //将之前蛇的类名全部清空
	}
	allArr[eggY][eggX].className='';  //把蛋给去掉
	x=4;
	y=0;
	//创建蛇身，将蛇身上色(重新载入对象)
	snakeArr=[];
	for (var i=0;i<5;i++) {
		snakeArr.push(allArr[0][i]);
		snakeArr[i].className='snake';
	}
	createEgg();
	direction='right';
	score=0;
	oScore.innerHTML='得分 : 0  分';
}

/* 设置对象可用鼠标拖动
 * 注意 :使用之前需将wrap设置为绝对定位,且top和left值需为具体的px数值，且margin不能设置
 * @param obj   object 可用鼠标点击拖动的区域
 * @param wrap  object 整个移动的框
 */
function drag(obj,wrap){
	var isDown=false; //标记方块的拖拽状态，鼠标按下时为true
	var wrapLeft,wrapTop,mLeft,mTop;  //wrap的位置值及鼠标按下时的值
	
	obj.onmousedown=function(event){
	/* 当鼠标按下时，将鼠标的位置值和初始wrap的位置值记录下来
	 */
		isDown=true;
		mLeft=event.clientX; 
		mTop=event.clientY;
		wrapLeft=wrap.offsetLeft;
		wrapTop=wrap.offsetTop;
	}
	obj.onmouseup=function(){
		isDown=false;  //鼠标松开
	}
	document.onmousemove=function(event){
		if(isDown){
			wrap.style.left=event.clientX-mLeft+wrapLeft+"px";
			wrap.style.top=event.clientY-mTop+wrapTop+"px";
		}
	}
}

//localStorage.removeItem("max");  //想把历史最高分清掉的话可以运行这句