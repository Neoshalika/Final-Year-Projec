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
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

@Data
@Entity
@NoArgsConstructor
@JsonInclude(JsonInclude.Include.NON_NULL)
@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
public class Loan{
    @Id
    @GeneratedValue(strategy=GenerationType.IDENTITY)
    private Integer id;

    private String code;

    private LocalDate date;

    private BigDecimal amount;

    private BigDecimal monthlyinstallment;

    private BigDecimal balance;

    private String chequeno;

    private String chequebank;

    private String chequebranch;

    private LocalDate chequedate;

    @Lob
    private String reason;

    private LocalDateTime tocreation;


    @ManyToOne
    private Employee employee;

    @ManyToOne
    private Paymenttype paymenttype;

    @ManyToOne
    private Paymentstatus paymentstatus;

    @ManyToOne
    @JsonIgnoreProperties({"creator","status","tocreation","roleList"})
    private User creator;


    @JsonIgnore
    @OneToMany(mappedBy = "loan")
    private List<Loanrepayment> loanLoanrepaymentList;

    @JsonIgnore
    @OneToMany(mappedBy = "loan")
    private List<Salaryloan> salaryloanList;


    public Loan(Integer id){
        this.id = id;
    }

    public Loan(Integer id, String code, Employee employee, Paymenttype paymenttype, LocalDate date, BigDecimal amount, String chequeno){
        this.id = id;
        this.code = code;
        this.employee = employee;
        this.paymenttype = paymenttype;
        this.date = date;
        this.amount = amount;
        this.chequeno = chequeno;
    }

}