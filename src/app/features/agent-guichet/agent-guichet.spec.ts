import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AgentGuichet } from './agent-guichet';

describe('AgentGuichet', () => {
  let component: AgentGuichet;
  let fixture: ComponentFixture<AgentGuichet>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AgentGuichet]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AgentGuichet);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
