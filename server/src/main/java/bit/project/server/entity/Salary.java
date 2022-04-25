package bit.project.server.entity;

import lombok.Data;
import java.util.List;
import javax.persistence.*;
import java.time.LocalDate;
import javax.persistence.Id;
import java.math.BigDecimal;
import javax.persistence.Lob;
import java.time.LocalDateTime;
import lombok.NoArgsConstructor;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

@Data
@Entity
@NoArgsConstructor
@JsonInclude(JsonInclude.Include.NON_NULL)
@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
public class Salary{
    @Id
    @GeneratedValue(strategy=GenerationType.IDENTITY)
    private Integer id;

    private String code;

    private LocalDate month;

    private LocalDate date;

    private BigDecimal epf;

    private BigDecimal etf;

    private BigDecimal grossincome;

    private BigDecimal netsalary;

    @Lob
    private String description;

    private LocalDateTime tocreation;


    @ManyToOne
    private Employee employee;

    @OneToMany(mappedBy="salary", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Allowance> allowanceList;

    @OneToMany(mappedBy="salary", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Salaryloan> salaryloanList;

    @OneToMany(mappedBy="salary", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Deduction> deductionList;

    @ManyToOne
    @JsonIgnoreProperties({"creator","status","tocreation","roleList"})
    private User creator;


    @ManyToMany
        @JoinTable(
        name="salaryadvancedpayment",
        joinColumns=@JoinColumn(name="salary_id", referencedColumnName="id"),
        inverseJoinColumns=@JoinColumn(name="advancedpayment_id", referencedColumnName="id")
    )
    private List<Advancedpayment> advancedpaymentList;


    public Salary(Integer id){
        this.id = id;
    }

    public Salary(Integer id, String code, Employee employee, LocalDate month, BigDecimal epf, BigDecimal etf){
        this.id = id;
        this.code = code;
        this.employee = employee;
        this.month = month;
        this.epf = epf;
        this.etf = etf;
    }

}