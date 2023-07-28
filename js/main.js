(() => {

    let yOffset = 0; // window.pageYOffset 대신 쓸 변수
    let prevScrollHeight = 0; // 현재 스크롤 위치(yOffset)보다 이전에 위치한 스크롤 섹션들의 스크롤 높이값의 합
    let currentScene = 0; // 현재 활성화된(눈 앞에 보고있는) 씬(scroll-section)
    let enterNewScene = false; // 새로운 scene이 시작된 순간 true

    const sceneInfo = [
        {
            // 0
            type: 'sticky',
            heigtNum: 5, // 브라우저 높이의 5배로 scrollHeight 세팅
            scrollHeight: 0,
            objs: {
                container: document.querySelector('#scroll-section-0'),
                messageA: document.querySelector('#scroll-section-0 .main-message.main-a'),
                messageB: document.querySelector('#scroll-section-0 .main-message.main-b'),
                messageC: document.querySelector('#scroll-section-0 .main-message.main-c'),
                messageD: document.querySelector('#scroll-section-0 .main-message.main-d'),
            },
            values: {
                messageA_opacity_in: [0, 1, { start: 0.1, end: 0.2 }],
                messageB_opacity_in: [0, 1, { start: 0.3, end: 0.4 }],
                messageC_opacity_in: [0, 1, { start: 0.5, end: 0.6 }],
                messageD_opacity_in: [0, 1, { start: 0.7, end: 0.8 }]

            }
        },
        {
            // 1
            type: 'normal',
            heigtNum: 5, // 브라우저 높이의 5배로 scrollHeight 세팅
            scrollHeight: 0,
            objs: {
                container: document.querySelector('#scroll-section-1')
            }
        },
        {
            // 2
            type: 'sticky',
            heigtNum: 5, // 브라우저 높이의 5배로 scrollHeight 세팅
            scrollHeight: 0,
            objs: {
                container: document.querySelector('#scroll-section-2')
            }
        },
        {
            // 3
            type: 'sticky',
            heigtNum: 5, // 브라우저 높이의 5배로 scrollHeight 세팅
            scrollHeight: 0,
            objs: {
                container: document.querySelector('#scroll-section-3')
            }
        }
    ];

    function setLayout() {
        // 각 스크롤 섹션의 높이 세팅
        for (let i = 0; i < sceneInfo.length; i++) {
            sceneInfo[i].scrollHeight = sceneInfo[i].heigtNum * window.innerHeight;
            sceneInfo[i].objs.container.style.height = `${sceneInfo[i].scrollHeight}px`;
        }
        // 현재 활성화된 씬 세팅

        yOffset = window.scrollY;
        let totalScrollHeight = 0;

        for (let i = 0; i < sceneInfo.length; i++) {
            totalScrollHeight += sceneInfo[i].scrollHeight;
            if (totalScrollHeight >= yOffset) {
                currentScene = i;
                break;
            }
        }
        document.body.setAttribute('id', `show-scene-${currentScene}`);

    }

    function calcValues(values, currentYoffset) {
        let rv;
        // 현재 씬에서 스크롤된 범위를 비율로 구하기
        let scrollRatio = currentYoffset / sceneInfo[currentScene].scrollHeight;
        // 현재 스크롤 위치를 기준으로 객체의 opacity를 계산,
        // scrollRatio 변수에 messageA_opacity_in 배열 값의 차이를 곱하고, 그 결과를 messageA_opacity_in 배열의 첫 번째 값에 더함으로써 이를 수행
        rv = scrollRatio * (values[1] - values[0]) + values[0];

        return rv;
    }

    
    function playAnimation() {
        const objs = sceneInfo[currentScene].objs;
        const values = sceneInfo[currentScene].values;
        const currentYoffset = yOffset - prevScrollHeight; //현재 씬을 기준으로 스크롤 위치를 계산

        // console.log(currentScene,currentYoffset);

        switch (currentScene) {
            case 0:
                // console.log('0 play');
                let messageA_opacity_in = calcValues(values.messageA_opacity_in, currentYoffset);
                objs.messageA.style.opacity = messageA_opacity_in;
                console.log(messageA_opacity_in);
                break;
            case 1:
                // console.log('1 play');
                break;
            case 2:
                // console.log('2 play');
                break;
            case 3:
                // console.log('3 play');
                break;
        }

    }

    function scrollLoop() {
        enterNewScene = false;
        prevScrollHeight = 0;
        //모든 이전 씬의 총 스크롤 높이를 계산하는 루프
        for (let i = 0; i < currentScene; i++) {
            prevScrollHeight += sceneInfo[i].scrollHeight;
        }
        //사용자의 스크롤 위치를 기반으로 현재 활성화된 씬을 결정하는데 사용
        if (yOffset > prevScrollHeight + sceneInfo[currentScene].scrollHeight) {
            enterNewScene = true;
            currentScene++;
            document.body.setAttribute('id', `show-scene-${currentScene}`);

        }
        //사용자가 이전 씬으로 스크롤되었는지 여부를 판단하기 위해 사용
        if (yOffset < prevScrollHeight) {
            enterNewScene = true;
            if (currentScene === 0) return; // 브라우저 바운스 효과로 인해 마이너스가 되는 것을 방지
            currentScene--;
            document.body.setAttribute('id', `show-scene-${currentScene}`);

        }
        // enterNewScene이 true일 때 playAnimation 함수를 실행
        if(enterNewScene) return;
        playAnimation();
    }





        window.addEventListener('scroll', () => {
            //  IE에서는 scrollY 대신 pageYOffset 사용
            yOffset = window.scrollY;
            scrollLoop();
        });

        window.addEventListener('DOMContentLoaded', setLayout);
        window.addEventListener('resize', setLayout);

        setLayout();

    }) ();
