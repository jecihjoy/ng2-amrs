
import { LocalStorageService } from '../utils/local-storage.service';
import { AppSettingsService } from '../app-settings/app-settings.service';
import { EncounterResourceService } from './encounter-resource.service';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
describe('EncounterResourceService', () => {

    let httpMock: HttpTestingController;
    let service: EncounterResourceService;
    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [
                EncounterResourceService,
                AppSettingsService,
                LocalStorageService
            ],
            imports: [
                HttpClientTestingModule
            ]
        });

        service = TestBed.get(EncounterResourceService);
        
        httpMock = TestBed.get(HttpTestingController);
    });

    afterAll(() => {
        httpMock.verify();
        TestBed.resetTestingModule();
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });
    describe('get Encounters by PatientUuid', () => {
        let encountersResponse = {
            results: [
                {
                    'uuid': '927d9d1f-44ce-471e-a77b-d1f1342f43f6',
                    'encounterDatetime': '2011-02-09T00:00:00.000+0300',
                    'patient': {
                        'uuid': '922fc86d-ad42-4c50-98a6-b1f310863c07'
                    },
                    'form': {
                        'uuid': '4710fa02-46ee-421d-a951-9eb012e2e950',
                        'name': 'AMPATH Pediatric Return Visit Form 4.4 with Mother-Baby Link'
                    },
                    'location': {
                        'uuid': '08feb5b6-1352-11df-a1f1-0026b9348838',
                        'display': 'Amukura',
                        'links': [
                            {
                                'rel': 'self',
                                'uri': 'https://amrs.ampath.or.ke:8443/amrs/ws/rest/'
                            }
                        ]
                    }
                }]
        };

        it('should return null when PatientUuid not specified', () => {
            let uuid = '08feb5b6-1352-11df-a1f1-0026b9348838';
            httpMock.expectNone({})

            const result = service.getEncountersByPatientUuid(null);

            expect(result).toBeNull();
        });

        it('should call the right endpoint', () => {
            let patientUuid = 'uuid';
            service.getEncountersByPatientUuid(patientUuid).subscribe()

            const request = httpMock.expectOne(service.getUrl() + 'encounter' + '?patient=uuid&v=custom:(uuid,encounterDatetime,' +
            'patient:(uuid,uuid),form:(uuid,name),' +
            'visit:(uuid,display,auditInfo,startDatetime,stopDatetime,location:(uuid,display)' +
                    ',visitType:(uuid,name)),' +
            'location:ref,encounterType:ref,encounterProviders:(uuid,display,provider:(uuid,display)))');
            expect(request.request.method).toBe('GET');
            request.flush(encountersResponse);
        });


    });
    describe('get Encounter by uuid', () => {
        let encounterResponse = {
            'uuid': 'd9ad587c-1350-11df-a1f1-0026b9348838',
            'encounterDatetime': '2009-07-26T00:00:00.000+0300',
            'patient': {
                'uuid': '5de55880-1359-11df-a1f1-0026b9348838'
            },
            'form': {
                'uuid': 'dfac3ba8-1350-11df-a1f1-0026b9348838',
                'name': 'Dummy Registration Form'
            },
            'visit': null,
            'location': {
                'uuid': '08fec33a-1352-11df-a1f1-0026b9348838',
                'display': 'Location-16',
                'links': [
                    {
                        'rel': 'self',
                        'uri': 'https://amrs.ampath.or.ke:8443/amrs/ws/rest/v1/location'
                    }
                ]
            },
            'encounterType': {
                'uuid': 'df555734-1350-11df-a1f1-0026b9348838',
                'display': 'DUMMYREGISTRATION',
                'links': [
                    {
                        'rel': 'self',
                        'uri': 'https://amrs.ampath.or.ke:8443/amrs/ws/rest/v1/encountertype'
                    }
                ]
            }
        };

        it('should return null when params are not specified', () => {
            let patientUuid = 'uuid';
            let _customDefaultRep = 'custom:(uuid,encounterDatetime,' +
                'patient:(uuid,uuid,identifiers),form:(uuid,name),' +
                'visit:(uuid,visitType,display,startDatetime,stopDatetime),' +
                'location:ref,encounterType:ref,encounterProviders:(uuid,display' +
                ',provider:(uuid,display)),orders:full,obs:(uuid,obsDatetime,' +
                'concept:(uuid,uuid,name:(display)),value:ref,groupMembers))';

            httpMock.expectNone({})
            const result = service.getEncounterByUuid(null);

            expect(result).toBeNull();
        });
        it('should call the right endpoint', () => {
            let patientUuid = 'uuid';
            let _customDefaultRep = 'custom:(uuid,encounterDatetime,' +
                'patient:(uuid,uuid,identifiers),form:(uuid,name),' +
                'visit:(uuid,visitType,display,startDatetime,stopDatetime),' +
                'location:ref,encounterType:ref,encounterProviders:(uuid,display' +
                ',provider:(uuid,display)),orders:full,obs:(uuid,obsDatetime,' +
                'concept:(uuid,uuid,name:(display)),value:ref,groupMembers))';

            service.getEncounterByUuid(patientUuid).subscribe((res) => {
                expect(res).toEqual(encounterResponse);
            });
            const request = httpMock.expectOne(service.getUrl() + 'encounter/' + patientUuid + '?v=' +_customDefaultRep);
            expect(request.request.method).toBe('GET');
            request.flush(encounterResponse);

        });

    });
    describe('get Encounter types', () => {
        let encounterTypeResponse = {
            'results': [
                {
                    'uuid': 'df5549ce-1350-11df-a1f1-0026b9348838',
                    'display': 'ADHERENCEREINITIAL',
                    'links': [
                        {
                            'rel': 'self',
                            'uri': 'https://amrs.ampath.or.ke:8443/'
                        }
                    ]
                },
                {
                    'uuid': 'df5548c0-1350-11df-a1f1-0026b9348838',
                    'display': 'ADHERENCERETURN',
                    'links': [
                        {
                            'rel': 'self',
                            'uri': 'https://amrs.ampath.or.ke:8443/'
                        }
                    ]
                }
            ]
        };
        it('should return null when params are not specified', () => {

            httpMock.expectNone({});

            const result = service.getEncounterTypes(null);

            expect(result).toBeNull();
        });

        it('should call the right endpoint', () => {

            service.getEncounterTypes('all').subscribe()

            const request = httpMock.expectOne(service.getUrl() + 'encountertype');
            expect(request.request.url)
                .toBe('https://amrs.ampath.or.ke:8443/amrs/ws/rest/v1/encountertype');
            expect(request.request.method).toBe('GET');
            request.flush(encounterTypeResponse);
        });
    });

    describe('save new Encounter', () => {
        let newEncounterMock = {
            location: '08feb5b6-1352-11df-a1f1-0026b9348838',
            patient: '922fc86d-ad42-4c50-98a6-b1f310863c07',
            encounterDatetime: '2010-11-23T00:00:00.000+0300',
            encounterType: '927d9d1f-44ce-471e-a77b-d1f1342f43f6'
        };
        let newEncounterResponse = {
            'uuid': '927d9d1f-44ce-471e-a77b-d1f1342f43f6',
            'display': 'PEDSRETURN 23/11/2010',
            'encounterDatetime': '2010-11-23T00:00:00.000+0300',
            'patient': {
                'uuid': '922fc86d-ad42-4c50-98a6-b1f310863c07',
                'display': '',
                'links': [
                    {
                        'uri': 'https://test1.ampath.or.ke:8443/amrs/ws/rest/v1/',
                        'rel': 'self'
                    }
                ]
            },
            'location': {
                'uuid': '08feb5b6-1352-11df-a1f1-0026b9348838',
                'display': 'Location-5',
                'links': [
                    {
                        'uri': 'https://test1.ampath.or.ke:8443/amrs/ws/rest/v1',
                        'rel': 'self'
                    }
                ]
            }
        };
        it('should return null when params are not specified', () => {

            httpMock.expectNone({});
            const result = service.saveEncounter(null);

            expect(result).toBeNull();
        });
        it('should call the right endpoint', () => {

            service.saveEncounter(newEncounterMock).subscribe((res) => {
                expect(res).toEqual(newEncounterResponse);
            });

            const request = httpMock.expectOne(service.getUrl() + 'encounter');
            expect(request.request.method).toBe('POST');
            request.flush(newEncounterResponse);
        });
    });
    describe('update encounters', () => {
        let encounterMock = {
            location: '08feb5b6-1352-11df-a1f1-0026b9348838',
            patient: '922fc86d-ad42-4c50-98a6-b1f310863c07',
            encounterDatetime: '2010-11-23T00:00:00.000+0300',
            encounterType: '927d9d1f-44ce-471e-a77b-d1f1342f43f6'
        };
        let encounterResponse = {
            'uuid': '927d9d1f-44ce-471e-a77b-d1f1342f43f6',
            'display': 'PEDSRETURN 23/11/2010',
            'encounterDatetime': '2010-11-23T00:00:00.000+0300',
            'patient': {
                'uuid': '922fc86d-ad42-4c50-98a6-b1f310863c07',
                'display': '',
                'links': [
                    {
                        'uri': 'https://test1.ampath.or.ke:8443/amrs/ws/rest',
                        'rel': 'self'
                    }
                ]
            },
            'location': {
                'uuid': '08feb5b6-1352-11df-a1f1-0026b9348838',
                'display': 'Location-5',
                'links': [
                    {
                        'uri': 'https://test1.ampath.or.ke:8443/amrs/ws/rest',
                        'rel': 'self'
                    }
                ]
            }
        };
        let uuid = 'uuid';
        it('should return null when params are not specified', () => {
            httpMock.expectNone({});
            const result = service.updateEncounter(null, null);

            expect(result).toBeNull();
        });
        it('should call the right endpoint', () => {

            service.updateEncounter(uuid, encounterMock).subscribe((res) => {
                expect(res).toEqual(encounterResponse);
            });
            const request = httpMock.expectOne(service.getUrl() + 'encounter/' + uuid);
            expect(request.request.method).toBe('POST');
            request.flush(encounterResponse);
        });
    });

    describe('Should Delete encounters', () => {
        let uuid = 'uuid';
        it('should return null when params are not specified', () => {

            httpMock.expectNone(service.getUrl() + 'encounter/' + uuid + '?!purge');

            const result = service.voidEncounter(null);

            expect(result).toBeNull();
        });

        it('should call the right endpoint', () => {

            service.voidEncounter(uuid).subscribe((res) => {
                expect(res).toBe('deleted');
            })

            const request = httpMock.expectOne(service.getUrl() + 'encounter/' + uuid + '?!purge');
            expect(request.request.method).toBe('DELETE');
            request.flush('deleted');
        });
    });
});





