// 初始化一个4x4的棋盘，所有格子初始值为0
const board = Array.from({ length: 4 }, () => Array(4).fill(0));
// 初始化分数为0
let score = 0;

// 确保文档加载完成后绑定事件和初始化游戏
document.addEventListener('DOMContentLoaded', () => {
    // 绑定“New Game”按钮的点击事件，点击时重新开始游戏
    document.getElementById('newGameButton').addEventListener('click', newGame);
    // 监听键盘事件，用于处理方向键操作
    document.addEventListener('keydown', handleKeyPress);
    // 监听触摸开始事件，用于移动设备上的滑动操作
    document.addEventListener('touchstart', handleTouchStart, false);
    // 监听触摸结束事件，用于移动设备上的滑动操作
    document.addEventListener('touchend', handleTouchEnd, false);
    // 初始化游戏
    newGame();
});

/**
 * 初始化新游戏
 */
function newGame() {
    // 将棋盘所有格子重置为0
    for (let i = 0; i < 4; i++) {
        for (let j = 0; j < 4; j++) {
            board[i][j] = 0;
        }
    }
    // 重置分数
    score = 0;
    // 更新分数显示
    updateScore();
    // 在棋盘上随机生成两个新数字（2或4）
    generateNewNumber();
    generateNewNumber();
    // 更新棋盘显示
    updateBoard();
    // 隐藏“游戏结束”提示
    document.getElementById('gameover').style.display = 'none';
}

/**
 * 在棋盘的空格子中随机生成一个新数字（2或4）
 */
function generateNewNumber() {
    // 找出所有空格子
    let emptyCells = [];
    for (let i = 0; i < 4; i++) {
        for (let j = 0; j < 4; j++) {
            if (board[i][j] === 0) {
                emptyCells.push({ x: i, y: j });
            }
        }
    }
    // 如果没有空格子，直接返回
    if (emptyCells.length === 0) return;
    // 随机选择一个空格子
    const { x, y } = emptyCells[Math.floor(Math.random() * emptyCells.length)];
    // 在该格子中生成一个新数字（90%概率是2，10%概率是4）
    board[x][y] = Math.random() < 0.9 ? 2 : 4;
}

/**
 * 更新棋盘的显示内容
 */
function updateBoard() {
    // 遍历棋盘上的每个格子
    for (let i = 0; i < 4; i++) {
        for (let j = 0; j < 4; j++) {
            // 获取当前格子的HTML元素
            const cell = document.getElementById(`grid-cell-${i}-${j}`);
            const img = cell.querySelector('img');
            // 如果格子为空，则清空图片
            if (board[i][j] === 0) {
                img.src = '';
            } else {
                // 否则，根据格子中的数字加载对应的图片
                img.src = `${board[i][j]}.png`;
            }
            // 设置格子的背景颜色
            cell.style.backgroundColor = getBackgroundColor(board[i][j]);
        }
    }
}

/**
 * 根据数字返回对应的背景颜色
 * @param {number} value - 格子中的数字
 * @returns {string} - 对应的背景颜色
 */
function getBackgroundColor(value) {
    switch (value) {
        case 2: return '#eee4da';
        case 4: return '#ede0c8';
        case 8: return '#f2b179';
        case 16: return '#f59563';
        case 32: return '#f67c5f';
        case 64: return '#f65e3b';
        case 128: return '#edcf72';
        case 256: return '#edcc61';
        case 512: return '#edc850';
        case 1024: return '#edc53f';
        case 2048: return '#edc22e';
        default: return '#cdc1b4';
    }
}

/**
 * 处理键盘事件，根据按下的方向键执行对应的移动操作
 * @param {Event} event - 键盘事件
 */
function handleKeyPress(event) {
    // 根据按键类型调用对应的移动函数
    switch (event.key) {
        case 'ArrowUp':
            moveUp();
            break;
        case 'ArrowDown':
            moveDown();
            break;
        case 'ArrowLeft':
            moveLeft();
            break;
        case 'ArrowRight':
            moveRight();
            break;
    }
    // 生成新数字并更新棋盘显示
    generateNewNumber();
    updateBoard();
    // 检查游戏是否结束
    if (isGameOver()) {
        document.getElementById('gameover').style.display = 'block';
    }
}

/**
 * 处理触摸开始事件，记录触摸的起始位置
 * @param {Event} event - 触摸事件
 */
let startX, startY;
function handleTouchStart(event) {
    startX = event.touches[0].clientX;
    startY = event.touches[0].clientY;
}

/**
 * 处理触摸结束事件，根据触摸的滑动方向执行对应的移动操作
 * @param {Event} event - 触摸事件
 */
function handleTouchEnd(event) {
    const endX = event.changedTouches[0].clientX;
    const endY = event.changedTouches[0].clientY;

    const deltaX = endX - startX; // 水平方向的滑动距离
    const deltaY = endY - startY; // 垂直方向的滑动距离

    // 判断滑动方向
    if (Math.abs(deltaX) > Math.abs(deltaY)) {
        if (deltaX > 0) {
            moveRight(); // 向右滑动
        } else {
            moveLeft(); // 向左滑动
        }
    } else {
        if (deltaY > 0) {
            moveDown(); // 向下滑动
        } else {
            moveUp(); // 向上滑动
        }
    }
    // 生成新数字并更新棋盘显示
    generateNewNumber();
    updateBoard();
    // 检查游戏是否结束
    if (isGameOver()) {
        document.getElementById('gameover').style.display = 'block';
    }
}

/**
 * 向上移动操作
 */
function moveUp() {
    for (let j = 0; j < 4; j++) {
        // 提取当前列的数据，压缩并合并数字
        let compressed = compress(board.map(row => row[j]));
        // 将处理后的数据放回棋盘
        for (let i = 0; i < 4; i++) {
            board[i][j] = compressed[i];
        }
    }
}

/**
 * 向下移动操作
 */
function moveDown() {
    for (let j = 0; j < 4; j++) {
        // 提取当前列的数据，反转，压缩并合并数字，再反转回来
        let compressed = compress(board.map(row => row[j]).reverse()).reverse();
        // 将处理后的数据放回棋盘
        for (let i = 0; i < 4; i++) {
            board[i][j] = compressed[i];
        }
    }
}

/**
 * 向左移动操作
 */
function moveLeft() {
    for (let i = 0; i < 4; i++) {
        // 对当前行进行压缩和合并
        board[i] = compress(board[i]);
    }
}

/**
 * 向右移动操作
 */
function moveRight() {
    for (let i = 0; i < 4; i++) {
        // 对当前行进行反转，压缩和合并，再反转回来
        board[i] = compress(board[i].reverse()).reverse();
    }
}

/**
 * 压缩和合并数字的逻辑
 * @param {Array<number>} row - 当前行或列的数据
 * @returns {Array<number>} - 处理后的数据
 */
function compress(row) {
    let newRow = row.filter(val => val !== 0); // 去掉所有0
    for (let i = 0; i < newRow.length - 1; i++) {
        if (newRow[i] === newRow[i + 1]) {
            newRow[i] *= 2; // 合并数字
            score += newRow[i]; // 更新分数
            newRow[i + 1] = 0; // 将合并后的数字置为0
        }
    }
    newRow = newRow.filter(val => val !== 0); // 再次去掉所有0
    while (newRow.length < 4) {
        newRow.push(0); // 补齐到4个元素
    }
    updateScore(); // 更新分数显示
    return newRow;
}

/**
 * 更新分数显示
 */
function updateScore() {
    document.getElementById('score').textContent = score;
}

/**
 * 检查游戏是否结束
 * @returns {boolean} - 是否结束
 */
function isGameOver() {
    for (let i = 0; i < 4; i++) {
        for (let j = 0; j < 4; j++) {
            if (board[i][j] === 0) return false; // 还有空格子，游戏未结束
            if (i < 3 && board[i][j] === board[i + 1][j]) return false; // 下方有相同数字
            if (j < 3 && board[i][j] === board[i][j + 1]) return false; // 右侧有相同数字
        }
    }
    return true; // 没有空格子且没有可合并的数字，游戏结束
}