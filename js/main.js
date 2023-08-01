(() => {

    let yOffset = 0; // window.pageYOffset 대신 쓸 변수
    let prevScrollHeight = 0; // 현재 스크롤 위치(yOffset)보다 이전에 위치한 스크롤 섹션들의 스크롤 높이값의 합
    let currentScene = 0; // 현재 활성화된(눈 앞에 보고있는) 씬(scroll-section)
    let enterNewScene = false; // 새로운 scene이 시작된 순간 true

    const sceneInfo = [
        {
            // 0
            type: 'sticky',
            heightNum: 5, // 브라우저 높이의 5배로 scrollHeight 세팅
            scrollHeight: 0,
            objs: {
                container: document.querySelector('#scroll-section-0'),
                messageA: document.querySelector('#scroll-section-0 .main-message.main-a'),
                messageB: document.querySelector('#scroll-section-0 .main-message.main-b'),
                messageC: document.querySelector('#scroll-section-0 .main-message.main-c'),
                messageD: document.querySelector('#scroll-section-0 .main-message.main-d'),
                canvas: document.querySelector('#video-canvas-0'),
                context: document.querySelector('#video-canvas-0').getContext('2d'), // canvas를 사용하기 위해 context를 가져옴
                videoImages: [] // 이미지 객체들을 담을 배열
            },
            values: {
                messageA_opacity_in: [0, 1, { start: 0.1, end: 0.2 }],
                messageB_opacity_in: [0, 1, { start: 0.3, end: 0.4 }],
                messageC_opacity_in: [0, 1, { start: 0.5, end: 0.6 }],
                messageD_opacity_in: [0, 1, { start: 0.7, end: 0.8 }],
                messageA_translateY_in: [30, 0, { start: 0.1, end: 0.2 }],
                messageB_translateY_in: [30, 0, { start: 0.3, end: 0.4 }],
                messageC_translateY_in: [30, 0, { start: 0.5, end: 0.6 }],
                messageD_translateY_in: [30, 0, { start: 0.7, end: 0.8 }],
                messageA_opacity_out: [1, 0, { start: 0.25, end: 0.3 }],
                messageB_opacity_out: [1, 0, { start: 0.45, end: 0.5 }],
                messageC_opacity_out: [1, 0, { start: 0.65, end: 0.7 }],
                messageD_opacity_out: [1, 0, { start: 0.85, end: 0.9 }],
                messageA_translateY_out: [0, -30, { start: 0.25, end: 0.3 }],
                messageB_translateY_out: [0, -30, { start: 0.45, end: 0.5 }],
                messageC_translateY_out: [0, -30, { start: 0.65, end: 0.7 }],
                messageD_translateY_out: [0, -30, { start: 0.85, end: 0.9 }],
                videoImageCount: 300, // 이미지 개수
                imageSequence: [0, 299], // 이미지 순서
                canvas_opacity_in: [1, 0, { start: 0.9, end: 1 }],
            }
        },
        {
            // 1
            type: 'normal',
            // heigtNum: 5, // type normal에서는 필요 없음
            scrollHeight: 0,
            objs: {
                container: document.querySelector('#scroll-section-1'),
            }
        },
        {
            // 2
            type: 'sticky',
            heightNum: 5, // 브라우저 높이의 5배로 scrollHeight 세팅
            scrollHeight: 0, 
            objs: {
                container: document.querySelector('#scroll-section-2'),
                messageA: document.querySelector('#scroll-section-2 .main-a'),
                messageB: document.querySelector('#scroll-section-2 .main-b'),
                messageC: document.querySelector('#scroll-section-2 .main-c'),
                pinB: document.querySelector('#scroll-section-2 .main-b .pin'),
                pinC: document.querySelector('#scroll-section-2 .main-c .pin')
            },
            values: {
                messageA_translateY_in: [30, 0, { start: 0.15, end: 0.2 }],
                messageB_translateY_in: [40, 0, { start: 0.5, end: 0.55 }],
                messageC_translateY_in: [40, 0, { start: 0.72, end: 0.77 }],
                messageA_opacity_in: [0, 1, { start: 0.15, end: 0.2 }],
                messageB_opacity_in: [0, 1, { start: 0.5, end: 0.55 }],
                messageC_opacity_in: [0, 1, { start: 0.72, end: 0.77 }],
                messageA_translateY_out: [0, -30, { start: 0.3, end: 0.35 }],
                messageB_translateY_out: [0, -30, { start: 0.58, end: 0.63 }],
                messageC_translateY_out: [0, -30, { start: 0.85, end: 0.9 }],
                messageA_opacity_out: [1, 0, { start: 0.3, end: 0.35 }],
                messageB_opacity_out: [1, 0, { start: 0.58, end: 0.63 }],
                messageC_opacity_out: [1, 0, { start: 0.85, end: 0.9 }],
                pinB_scaleY: [0.5, 1, { start: 0.5, end: 0.55 }],
                pinC_scaleY: [0.5, 1, { start: 0.72, end: 0.77 }],
                pinB_opacity_in: [0, 1, { start: 0.5, end: 0.55 }],
                pinC_opacity_in: [0, 1, { start: 0.72, end: 0.77 }],
                pinB_opacity_out: [1, 0, { start: 0.58, end: 0.63 }],
                pinC_opacity_out: [1, 0, { start: 0.85, end: 0.9 }]
            }
        },
        {
            // 3
            type: 'sticky',
            heightNum: 5, // 브라우저 높이의 5배로 scrollHeight 세팅
            scrollHeight: 0,
            objs: {
                container: document.querySelector('#scroll-section-3')
            }
        }
    ];

    function setcanvasImages() {
        let imgElem;
        for (let i = 0; i <sceneInfo[0].values.videoImageCount; i++){
            imgElem = new Image(); // 이미지 객체 생성 document.createElement('img')
            imgElem.src = `./video/001/IMG_${6726 + i}.JPG`; // 이미지 경로 지정
            sceneInfo[0].objs.videoImages.push(imgElem); // 이미지 객체를 배열에 저장
        }
    }
    setcanvasImages();

    function setLayout() {
        // 각 스크롤 섹션의 높이 세팅
        	for (let i = 0; i < sceneInfo.length; i++) {
			if (sceneInfo[i].type === 'sticky') {
				sceneInfo[i].scrollHeight = sceneInfo[i].heightNum * window.innerHeight;
			} else if (sceneInfo[i].type === 'normal')  {
				sceneInfo[i].scrollHeight = sceneInfo[i].objs.container.offsetHeight;
			}
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

        const heightRatio = window.innerHeight / 1080; // 브라우저 높이에 따른 비율로 캔버스 높이 조절
        sceneInfo[0].objs.canvas.style.transform = `translate3d(-50%, -50%, 0) scale(${heightRatio})`; // 캔버스 크기 조절

    }

    function calcValues(values, currentYoffset) {
        let rv;
        // 현재 씬에서 스크롤된 범위를 비율로 구하기
        const scrollHeight = sceneInfo[currentScene].scrollHeight;
        const scrollRatio = currentYoffset / scrollHeight;

        if (values.length === 3) {
            // start ~ end 사이에 애니메이션 실행
            const partScrollStart = values[2].start * scrollHeight;
            const partScrollEnd = values[2].end * scrollHeight;
            const partScrollHeight = partScrollEnd - partScrollStart;


            if (currentYoffset >= partScrollStart && currentYoffset <= partScrollEnd) { //현재 스크롤 위치가 start와 end 사이에 있다면
                rv = (currentYoffset - partScrollStart) / partScrollHeight * (values[1] - values[0]) + values[0]; //현재 스크롤 위치를 기준으로 start와 end 사이의 비율을 구한 뒤, 비율에 따라 값을 계산
            }
            else if (currentYoffset < partScrollStart) { //현재 스크롤 위치가 start보다 적다면
                rv = values[0];
            }
            else if (currentYoffset > partScrollEnd) {
                rv = values[1];
            }

        } else {
            rv = scrollRatio * (values[1] - values[0]) + values[0];
        }
        // 현재 스크롤 위치를 기준으로 객체의 opacity를 계산,
        // scrollRatio 변수에 messageA_opacity_in 배열 값의 차이를 곱하고, 그 결과를 messageA_opacity_in 배열의 첫 번째 값에 더함으로써 이를 수행


        return rv;
    }


    function playAnimation() {
        const objs = sceneInfo[currentScene].objs;
        const values = sceneInfo[currentScene].values;
        const currentYoffset = yOffset - prevScrollHeight; //현재 씬을 기준으로 스크롤 위치를 계산
        const scrollHeight = sceneInfo[currentScene].scrollHeight; //현재 씬의 scrollHeight
        const scrollRatio = currentYoffset / scrollHeight; //현재 씬에서 스크롤된 범위를 비율로 구하기

        // console.log(currentScene,currentYoffset);

        switch (currentScene) {
            case 0:
                // console.log('0 play');
                let sequence = Math.round(calcValues(values.imageSequence, currentYoffset)); // 현재 씬에서 스크롤된 범위를 비율로 구하기
                objs.context.drawImage(objs.videoImages[sequence], 0, 0); // 이미지를 그림
                objs.canvas.style.opacity = calcValues(values.canvas_opacity_in, currentYoffset);//현재 스크롤 위치를 기준으로 객체의 opacity를 계산

                if (scrollRatio <= 0.22) {
                    //in
                    objs.messageA.style.opacity = calcValues(values.messageA_opacity_in, currentYoffset); //현재 스크롤 위치를 기준으로 객체의 opacity를 계산
                    objs.messageA.style.transform = `translate3d(${calcValues(values.messageA_translateY_in, currentYoffset)}%, 0)`; //현재 스크롤 위치를 기준으로 객체의 transform을 계산
                } else {
                    //out
                    objs.messageA.style.opacity = calcValues(values.messageA_opacity_out, currentYoffset);
                    objs.messageA.style.transform = `translate3d(${calcValues(values.messageA_translateY_out, currentYoffset)}%, 0)`;
                }
                if (scrollRatio <= 0.42) {
                    // in
                    objs.messageB.style.opacity = calcValues(values.messageB_opacity_in, currentYoffset);
                    objs.messageB.style.transform = `translate3d(0, ${calcValues(values.messageB_translateY_in, currentYoffset)}%, 0)`;
                } else {
                    // out
                    objs.messageB.style.opacity = calcValues(values.messageB_opacity_out, currentYoffset);
                    objs.messageB.style.transform = `translate3d(0, ${calcValues(values.messageB_translateY_out, currentYoffset)}%, 0)`;
                }

                if (scrollRatio <= 0.62) {
                    // in
                    objs.messageC.style.opacity = calcValues(values.messageC_opacity_in, currentYoffset);
                    objs.messageC.style.transform = `translate3d(0, ${calcValues(values.messageC_translateY_in, currentYoffset)}%, 0)`;
                } else {
                    // out
                    objs.messageC.style.opacity = calcValues(values.messageC_opacity_out, currentYoffset);
                    objs.messageC.style.transform = `translate3d(0, ${calcValues(values.messageC_translateY_out, currentYoffset)}%, 0)`;
                }

                if (scrollRatio <= 0.82) {
                    // in
                    objs.messageD.style.opacity = calcValues(values.messageD_opacity_in, currentYoffset);
                    objs.messageD.style.transform = `translate3d(0, ${calcValues(values.messageD_translateY_in, currentYoffset)}%, 0)`;
                } else {
                    // out
                    objs.messageD.style.opacity = calcValues(values.messageD_opacity_out, currentYoffset);
                    objs.messageD.style.transform = `translate3d(0, ${calcValues(values.messageD_translateY_out, currentYoffset)}%, 0)`;
                }

                break;
            case 2:
                // console.log('2 play');
                if (scrollRatio <= 0.32) {
                    // in
                    objs.messageA.style.opacity = calcValues(values.messageA_opacity_in, currentYoffset);
                    objs.messageA.style.transform = `translate3d(0, ${calcValues(values.messageA_translateY_in, currentYoffset)}%, 0)`;
                } else {
                    // out
                    objs.messageA.style.opacity = calcValues(values.messageA_opacity_out, currentYoffset);
                    objs.messageA.style.transform = `translate3d(0, ${calcValues(values.messageA_translateY_out, currentYoffset)}%, 0)`;
                }
                if (scrollRatio <= 0.67) {
                    // in
                    objs.messageB.style.transform = `translate3d(${calcValues(values.messageB_translateY_in, currentYoffset)}%, 0, 0)`;
                    objs.messageB.style.opacity = calcValues(values.messageB_opacity_in, currentYoffset);
                    objs.pinB.style.transform = `scaleY(${calcValues(values.pinB_scaleY, currentYoffset)})`;
                } else {
                    // out
                    objs.messageB.style.transform = `translate3d(${calcValues(values.messageB_translateY_out, currentYoffset)}%, 0, 0)`;
                    objs.messageB.style.opacity = calcValues(values.messageB_opacity_out, currentYoffset);
                    objs.pinB.style.transform = `scaleY(${calcValues(values.pinB_scaleY, currentYoffset)})`;
                }
                if (scrollRatio <= 0.93) {
                    // in
                    objs.messageC.style.transform = `translate3d(${calcValues(values.messageC_translateY_in, currentYoffset)}%, 0, 0)`;
                    objs.messageC.style.opacity = calcValues(values.messageC_opacity_in, currentYoffset);
                    objs.pinC.style.transform = `scaleY(${calcValues(values.pinC_scaleY, currentYoffset)})`;
                } else {
                    // out
                    objs.messageC.style.transform = `translate3d(${calcValues(values.messageC_translateY_out, currentYoffset)}%, 0, 0)`;
                    objs.messageC.style.opacity = calcValues(values.messageC_opacity_out, currentYoffset);
                    objs.pinC.style.transform = `scaleY(${calcValues(values.pinC_scaleY, currentYoffset)})`;
                }

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
        if (enterNewScene) return;
        playAnimation();
    }





    window.addEventListener('scroll', () => {
        //  IE에서는 scrollY 대신 pageYOffset 사용
        yOffset = window.scrollY;
        scrollLoop();
    });

    window.addEventListener('DOMContentLoaded', () => {
        setLayout();
        sceneInfo[0].objs.context.drawImage(sceneInfo[0].objs.videoImages[0], 0, 0);

    });
    window.addEventListener('resize', setLayout);

    setLayout();

})();
