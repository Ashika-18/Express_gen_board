var express = require('express');
var router = express.Router();

//prisma@client
const ps = require('@prisma/client');
const prisma = new ps.PrismaClient();

//1ページあたりの表示数
const pnum = 5;

//ログインのチェック
const check = (req, res) => {
    if (req.session.login == null) {
        req.session.back = '/boards';
        res.redirect('/users/login');
        return true;
    } else {
        return false;
    }
}

//TOPページ
router.get('/', (req, res, next) => {
    res.redirect('/boards/0');
});

//TOPページにページ番号をつけてアクセス
router.get('/:page', (req, res, next) => {
    if (check(req, res)) {return};
    const pg = +req.params.page;
    prisma.Board.findMany({
        skip: pg * pnum,
        take: pnum,
        orderBy: [
            {createdAt: 'desc'}
        ],
        include: {
            account: true,
        },
    }).then(brds => {
        var data = {
            title: 'Boards',
            login: req.session.login,
            content: brds,
            page: pg
        }
        res.render('boards/index', data);
    });
});

//メッセージフォームの送信処理
router.post('/add', (req, res, next) => {
    if (check(req, res)) {return};
    prisma.Board.create({
        data: {
            accountId: req.session.login.id,
            message: req.body.msg
        }
    }).then(() => {
        res.redirect('/boards');
    })
    .catch((err) => {
        res.redirect('/boards/add');
    })
});

//利用者のホーム
router.get('/home/:usr/:id/:page', (req, res, next) => {
    if (check(res, res)) {return};
    const id = +req.params.id;
    const pg = +req.params.page;
    prisma.Board.findMany({
        where: {accountId: id},
        skip: pg * pnum,
        take: pnum,
        orderBy: [
            {createdAt: 'desc'}
        ],
        include: {
            account: true,
        },
    }).then(brds => {
        const data = {
            title: 'Boards',
            login: req.session.login,
            accountId: id,
            userName: req.params.user,
            content: brds,
            page: pg
        }
        res.render('boards/home', data);
    });
});

module.exports = router;