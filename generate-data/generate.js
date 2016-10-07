'use strict';

const fs = require('fs');

const text = fs.readFileSync('report3-base.json');
const dataModel = JSON.parse(text.toString());
//console.log('base data model', dataModel);

const personLoModel = { 
    id: '', 
    value: -1, 
    segmentId: ''
};

dataModel.stores.forEach((store) => {
    console.log('store', store.id);
    store.people.forEach((person) => {
        console.log('person ' + person.id, person.los);

        dataModel.segments.forEach((segment) => {
            console.log('segment', segment.id);
            segment.los.forEach((lo) => {
                console.log('lo', lo);

                if (person.title === 'Manager' && lo.id.indexOf('crew') > -1) {
                    // ignore
                } else {
                    var rand = Math.random();
                    personLoModel.id = lo.id;
                    personLoModel.segmentId = segment.id;
                    personLoModel.value =  rand > 0.7 ? 2 : rand > 0.3 ? 1 : 0;
                    
                    person.los.push(JSON.parse(JSON.stringify(personLoModel)));
                }
            });
        });

    });
});

console.log('final data model', JSON.stringify(dataModel));
//fs.writeFileSync(JSON.stringify(dataModel), 'report3-generated.json');

